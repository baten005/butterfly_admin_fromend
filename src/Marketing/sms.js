import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/sidebar";
import { connect } from "react-redux";
import styles from "../Styles/sms.module.css";
import axiosInstance from "../AxiosInstance/axiosinstance";
import { toast, ToastContainer } from "react-toastify";

function Sms({ collapsed }) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [groups, setGroups] = useState([]);
  const [sms, setSms] = useState([]);
  const [fileName, setFileName] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    getGroups();
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
  };

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    axiosInstance.post(`/api/upload?fileName=${fileName}`, formData).then((res) => {
      getGroups();
    });
  };

  const handleAddExcelFile = () => {
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
    setLoading(true);
    axiosInstance
      .post("/sendBulkSms", {
        numbers: sms,
        message: inputValue,
      })
      .then((res) => {
        const { successCount, failedCount } = res.data;

        if (successCount === 0) {
          toast.error('0 SMS sent');
        } else if (failedCount === 0) {
          toast.success('All SMS are sent');
        } else {
          toast.warning(`${successCount} SMS sent, ${failedCount} SMS failed to send`);
        }
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        toast.error('Error sending SMS');
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleDownload = (fileName) => {
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
        getGroups();
      })
      .catch((error) => {
        console.error("Error deleting the file:", error);
      });
  };

  const formatNumbersForDisplay = () => {
    return sms.join(",");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setCharCount(value.length);
  };
  const calculateMessageCount = () => {
    return Math.ceil(charCount / 160);
  };

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
              <textarea
                placeholder="Text"
                onChange={handleInputChange}
                value={inputValue}
              ></textarea>
              <span className={styles.charCount}>
                {charCount}/{calculateMessageCount()} messages
              </span>
              <button className={styles.sendBtn} onClick={handleSendSms}>
                {loading?'Loading...':'Send'}
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
      <ToastContainer />
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
});

export default connect(mapStateToProps)(Sms);
