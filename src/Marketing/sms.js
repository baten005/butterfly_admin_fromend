import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/sidebar";
import { connect } from "react-redux";
import styles from "../Styles/sms.module.css";
import axiosInstance from "../AxiosInstance/axiosinstance";

function Sms({ collapsed }) {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [groups, setGroups] = useState([]);
  const [sms, setSms] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    getGroups()
  }, []);

  const getGroups = async () => {

    axiosInstance.get("/api/files").then((res) => {
      const files = res.data;
      const formattedGroups = files.map((file) => ({
        groupName: file.name,
        individuals: file.totalIndividuals,
        fileName: file.fileName
      }));
      setGroups(formattedGroups);
    });

  }

  const fileInputRef = useRef(null);


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    axiosInstance.post(`/api/upload?fileName=${fileName}`, formData).then((res) => {
      //console.log("File uploaded successfully", res.data);
      getGroups();
    });
  };

  const handleAddExcelFile = () => {
    //console.log("Button clicked!");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddGroupNumbers = (group) => {
    axiosInstance.get(`/api/file/${group.fileName}`).then((res) => {
      const phoneNumbers = res.data.phoneNumbers;
      setSms([...sms, ...phoneNumbers]);
    });
  };

  const handleSendSms = () => {
    axiosInstance
      .post("/sendBulkSms", {
        numbers: sms,
        message: inputValue,
      })
      .then((res) => {
        //console.log("SMS sent successfully", res.data);
      });
  };
  const handleDownload = (fileName) => {
    //const url = `/download/${fileName}`; 
    axiosInstance
      .get(`/downloadFiles?fileName=${fileName}`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Download error:", error);
      });
  };
  const handleDeleteFile = (fileName) => {
    axiosInstance
      .delete(`/delete/${fileName}`)
      .then((res) => {
        //console.log("File deleted successfully", res.data);
        // Refresh the group list after deletion
        getGroups();
      })
      .catch((error) => {
        console.error("Error deleting the file:", error);
      });
  };



  const formatNumbersForDisplay = () => {
    return sms.join(",");
  };
  //console.log('theese are groups', groups)
  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.smsContainer}>
          {/* Send SMS Section */}
          <div className={styles.sendSmsSection}>
            <h3 style={{ color: "white" }}>Send SMS</h3>
            <div className={styles.smsForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Select Individual Numbers"
                  value={formatNumbersForDisplay()}
                  onChange={(e) =>
                    setSms(e.target.value.split(",").map((phone) => phone.trim()))
                  }
                />
                <span>Selected: {sms.length === 0 ? sms.length : sms.length - 1} Numbers</span>
              </div>
              <textarea placeholder="Text" onChange={(e) => setInputValue(e.target.value)}></textarea>
              <button className={styles.sendBtn} onClick={handleSendSms}>
                Send
              </button>
            </div>
          </div>

          {/* AI Input Section */}
          <div className={styles.aiInputSection}>
            <h3 style={{ color: "white" }}>AI Input</h3>
            <div className={styles.aiForm}>
              <div className={styles.inputGroup}>
                <input type="text" placeholder="Group Name" onChange={(e) => setFileName(e.target.value)} />
                <button className={styles.excelBtn} onClick={handleAddExcelFile}>
                  + Add Excel/CSV File
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </div>
              <p>Must Contain a field: name, Number or phone number</p>
            </div>
          </div>

          {/* Table of Groups */}
          <div className={styles.groupTableContainer}>
            <table className={styles.groupTable}>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Individuals</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {groups.slice().reverse().map((group, index) => (
                  <tr key={index}>
                    <td>{group.groupName}</td>
                    <td>{group.individuals}</td>
                    <td>
                      <span
                        className={styles.add}
                        onClick={() => handleAddGroupNumbers(group)}
                      >
                        Add
                      </span>
                      <span className={styles.download} onClick={() => handleDownload(group.fileName)}>Download</span>{" "}
                      <span className={styles.delete} onClick={() => handleDeleteFile(group.fileName)}>Delete</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
});

export default connect(mapStateToProps)(Sms);
