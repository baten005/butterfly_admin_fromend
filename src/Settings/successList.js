import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/successList.module.css";
import { fetchSuccessList, updateSuccessList, setMessage } from "../store/actions/successListActions"; 
import { toast } from 'react-toastify';

function SuccessList({ collapsed, fetchSuccessList, updateSuccessList, successList, message, loading, setMessage }) {
  const [count, setCount] = useState('0');
  const [text, setText] = useState('');
  const [count1, setCount1] = useState('');
  const [text1, setText1] = useState('');

  useEffect(() => {
    fetchSuccessList();
  }, [fetchSuccessList]);

  useEffect(() => {
    if (successList && successList.length > 0) {
      setCount(successList[0].count || '0');
      setText(successList[0].text || '');
    }
  }, [successList]);

  useEffect(() => {
    if (message) {
      toast(message); // Show toast with the message
      setMessage(''); // Clear the message after showing toast
    }
  }, [message, setMessage]);

  const handleUpdate = async () => {
    try {
      await updateSuccessList(count1, text1);
      //toast.success('Successfully updated!'); // Show success toast
    } catch (error) {
      toast.error('Error updating success list'); // Show error toast
    }
  };

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <div style={styles1.successContainer}>
          <img src="rings.png" alt="success-icon" style={styles1.icon} />
          <h2 style={styles1.title}>{`${count}+ Success`}</h2>
          <p style={styles1.subtitle}>{text}</p>
        </div>

        <div style={styles1.inputContainer}>
          <label style={styles1.label}>The number of success</label>
          <input
            type="number"
            value={count1}
            onChange={(e) => setCount1(e.target.value)}
            style={styles1.input}
            disabled={loading}
          />
        </div>

        <p style={styles1.underText}>Under Text</p>

        <div style={styles1.footerText}>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            style={styles1.input2}
            disabled={loading}
          />
        </div>

        <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  successList: state.successList.successList,
  message: state.successList.message,
  loading: state.successList.loading,
});

const mapDispatchToProps = {
  fetchSuccessList,
  updateSuccessList,
  setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SuccessList);

const styles1 = {
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    margin: '20px auto',
    border: '1px solid #e0e0e0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    width: '50px',
    height: '50px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    color: '#8c6d1f',
    margin: '10px 0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '16px',
    color: '#777',
    textAlign: 'center',
    marginBottom: '20px',
    wordWrap: 'break-word',     
    wordBreak: 'break-word',    
    whiteSpace: 'normal',
  },
  inputContainer: {
    margin: '20px 0',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
  },
  label: {
    fontSize: '14px',
    color: '#555',
    display: 'block',
    margin: 'auto',
    marginBottom: '10px',
    marginRight: '10px',
  },
  input: {
    width: '250px',
    padding: '5px',
    fontSize: '16px',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  input2: {
    width: '410px',
    padding: '5px',
    fontSize: '16px',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginLeft: '10px',
    height: '150px',
  },
  underText: {
    fontSize: '14px',
    color: '#777',
    margin: '10px 0',
  },
  footerText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#555',
    padding: '10px',
    borderRadius: '6px',
    width: '100%',
    textAlign: 'center',
  },
};
