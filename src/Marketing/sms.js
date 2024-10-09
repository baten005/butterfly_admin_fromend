import React,{useState} from "react";
import Sidebar from "../Components/sidebar";
import { connect } from "react-redux";
import styles from "../Styles/sms.module.css";
function Sms({ collapsed }) {

    const [selectedNumbers, setSelectedNumbers] = useState(12); // Example state for selected numbers
  const [groups, setGroups] = useState([{ groupName: 'Balishira resort', individuals: 70 }]);

  const handleFileUpload = (e) => {
    // Logic for handling file upload
    console.log(e.target.files);
  };
  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.smsContainer}>
      {/* Send SMS Section */}
      <div className={styles.sendSmsSection}>
        <h3 style={{color:'white'}}>Send SMS</h3>
        <div className={styles.smsForm}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Individual Number or group" />
            <span>Selected: {selectedNumbers} Numbers</span>
          </div>
          <textarea placeholder="Text"></textarea>
        </div>
      </div>

      {/* AI Input Section */}
      <div className={styles.aiInputSection}>
        <h3 style={{color:'white'}}>AI Input</h3>
        <div className={styles.aiForm}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Group Name" />
            <button className={styles.excelBtn}>
              + Add Excel File
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </button>
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
            {groups.map((group, index) => (
              <tr key={index}>
                <td>{group.groupName}</td>
                <td>{group.individuals}</td>
                <td>
                  <span className={styles.download}>Download</span>{' '}
                  <span className={styles.delete}>Delete</span>
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
