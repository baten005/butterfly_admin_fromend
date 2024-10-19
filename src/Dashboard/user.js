import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/User.module.css";
import { FaEllipsisH } from "react-icons/fa";
import { fetchUsers } from "../store/actions/userActions";
import { Dropdown, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../AxiosInstance/axiosinstance";

function User({ collapsed, activeUsers, expiredUsers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [filteredActiveUsers, setFilteredActiveUsers] = useState([]);
  const [filteredExpiredUsers, setFilteredExpiredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [CV, setCV] = useState();
  const [deleteId, setDeleteId] = useState();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // 'en-GB' for day-month-year format
  };

  useEffect(() => {
    const filteredActive = activeUsers.length > 0 ? activeUsers.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

    const filteredExpired = expiredUsers.length > 0 ? expiredUsers.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

    setFilteredActiveUsers(filteredActive);
    setFilteredExpiredUsers(filteredExpired);
  }, [searchQuery, activeUsers, expiredUsers]);


  const handleUserExpire = async (id) => {
    try {
      const response = await axiosInstance.post(`/userExpired`, { id });
      //console.log(response);
      if (response.status === 200 && response.data.success) {
        toast.success("Updated successfully!");
        dispatch(fetchUsers());
      } else {
        toast.error("Failed to Update.");
      }
    } catch (error) {
      toast.error("Error occurred while Updating.");
    }
  };
  const handleUserActive = async (id) => {
    try {
      const response = await axiosInstance.post(`/userActivate`, { id });
      //console.log(response);
      if (response.status === 200 && response.data.success) {
        toast.success("Updated successfully!");
        dispatch(fetchUsers());
      } else {
        toast.error("Failed to Update.");
      }
    } catch (error) {
      toast.error("Error occurred while updating.");
    }
  };
  const handleUserDelete = (id) => {
    setShowModal(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.post(`/deleteUser`, { deleteId });
      //console.log(response);
      if (response.status === 200 && response.data.success) {
        toast.success("Deleted User successfully!");
        dispatch(fetchUsers());
        setShowModal(false);
      } else {
        toast.error("Failed to Delete User.");
      }
    } catch (error) {
      toast.error("Error occurred while Deleting User.");
    }
  };
  const handleModalOpen = () => {
    fetchCvs();
  };
  const fetchCvs = async () => {
    try {
      const response = await axiosInstance.get(`/getCvs`);
      //console.log(response, "this is cvs");
      setCvs(response.data);
      setShowModal1(true);
    } catch (error) {
      toast.error("Error occurred while Deleting User.");
    }
  }

  const filteredCVs = cvs.filter(
    (cv) =>
      (cv.fullname && cv.fullname.toLowerCase().includes(searchQuery1.toLowerCase())) ||
      (cv.phoneNumber && cv.phoneNumber.includes(searchQuery1))
  );

  const handleCreateUser1 = async (user) => {

    setCV(user);
    setShowModal2(true);

  }
  const handleCreateUser = async (user) => {
    try {
      setLoading(true)
      const response = await axiosInstance.post('/createUser', {
        Id: user.id,
        name: user.fullname,
        phoneNumber: user.phoneNumber,
      });
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message);
        dispatch(fetchUsers());
        fetchCvs();
      } else {
        toast.error("Failed to create user.");
      }
      setShowModal2(false);
    } catch (error) {
      toast.error("Error occurred while Creating user.");
    } finally {
      setLoading(false)
    }
  };

  //console.log(filteredActiveUsers,activeUsers, filteredExpiredUsers,expiredUsers, "bal bal bal");
  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <br />
        <br />
        <div className="input-group mb-6" style={{ display: "block" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search Here"
            aria-label="Search Here"
            aria-describedby="basic-addon1"
            style={{ width: "90%", padding: "15px", background: "#E3E3E3", borderRadius: "10px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            style={{ float: "inline-start", width: "118px", height: "43px", background: "#3F3D56", borderRadius: "10px", fontFamily: "Poppins", marginLeft: "5px", marginBottom: "5px", marginTop: "20px" }}
            onClick={() => handleModalOpen()}
          >
            Add User
          </button>

          <br />
        </div>

        <br />
        <br />
        <div className={styles.activeMembersContainer}>
          <h2 style={{ textAlign: "left", fontSize: "25px" }}>
            Active Members
          </h2>
          <p style={{ textAlign: "left", fontSize: "15px" }}>
            Currently availing service
          </p>
          <table style={styles1.table}>
            <thead>
              <tr>
                <th style={styles1.th}>NO</th>
                <th style={styles1.th}>Profile</th>
                <th style={styles1.th}>Name & Mail</th>
                <th style={styles1.th}>Join Date</th>
                <th style={styles1.th}>Status</th>
                <th style={styles1.th}></th>
              </tr>
            </thead>
            <tbody>
              {filteredActiveUsers.map((user, index) => (
                <tr key={index} style={styles1.tr}>
                  <td style={styles1.td}>{index + 1}</td>
                  <td style={styles1.td}>
                    <img
                      style={styles1.images}
                      src={"https://backend.butterfly.hurairaconsultancy.com/" + user.image1}
                      alt="Profile"
                    />
                  </td>
                  <td style={styles1.td}>
                    <div style={styles1.nameEmailContainer}>
                      <span style={styles1.name}>{user.name}</span>
                      <span style={styles1.email}>{user.email}</span>
                    </div>
                  </td>
                  <td className={styles.dateCell}>{formatDate(user.date)}</td>
                  <td className={styles.statusCell}>
                    <span
                      className={styles.status}
                      style={{
                        color: getStatusColor(user.status),
                        background: getStatusBackground(user.status),
                      }}
                    >
                      {formatStatus(user.status)}
                    </span>
                  </td>
                  <td style={styles1.td}>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="button"
                        style={{
                          padding: 0,
                          cursor: "pointer",
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '30px',
                          width: '30px',
                          borderRadius: '50%',
                          border: "1px solid var(--rn-53-themes-net-silver, #C3C3C3)",
                          backgroundColor: 'white',
                          margin: '-5px'
                        }}
                      >
                        <FaEllipsisH color="rgba(0,0,0,.5)" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ left: "-80px" }}>
                        <Dropdown.Item
                          onClick={() => handleUserExpire(user.id)}
                          style={{
                            color: "orange",
                            fontSize: "18px",
                            marginBottom: "10px",
                          }}
                        >
                          Expired
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => handleUserDelete(user.id)}
                          style={{ color: "red", fontSize: "18px" }}
                        >
                          Delete User
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div className={styles.activeMembersContainer}>
          <h2 style={{ textAlign: "left", fontSize: "25px" }}>
            Expired Members
          </h2>
          <p style={{ textAlign: "left", fontSize: "15px" }}>
            No longer availing service
          </p>
          <table style={styles1.table}>
            <thead>
              <tr>
                <th style={styles1.th}>NO</th>
                <th style={styles1.th}>Profile</th>
                <th style={styles1.th}>Name & Mail</th>
                <th style={styles1.th}>Join Date</th>
                <th style={styles1.th}>Status</th>
                <th style={styles1.th}></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpiredUsers.map((user, index) => (
                <tr key={index} style={{...styles1.tr,background:user.blocked=='0'?'':'rgba(254, 121, 104, .5)'}}>
                  <td style={styles1.td}>{index + 1}</td>
                  <td style={styles1.td}>
                    <img
                      style={styles1.images}
                      src={"https://backend.butterfly.hurairaconsultancy.com/" + user.image1}
                      alt="Profile"
                    />
                  </td>
                  <td style={styles1.td}>
                    <div style={styles1.nameEmailContainer}>
                      <span style={styles1.name}>{user.name}</span>
                      <span style={styles1.email}>{user.email}</span>
                    </div>
                  </td>
                  <td className={styles.dateCell}>{formatDate(user.date)}</td>
                  <td className={styles.statusCell}>
                    <span
                      className={styles.status}
                      style={{
                        color: getStatusColor(user.status),
                        background: getStatusBackground(user.status),
                      }}
                    >
                      {formatStatus(user.status)}
                    </span>
                  </td>
                  <td style={styles1.td}>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="button"
                        style={{
                          padding: 0,
                          cursor: "pointer",
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '30px',
                          width: '30px',
                          borderRadius: '50%',
                          border: "1px solid var(--rn-53-themes-net-silver, #C3C3C3)",
                          backgroundColor: 'white',
                          margin: '-5px'
                        }}
                      >
                        <FaEllipsisH color="rgba(0,0,0,.5)" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ left: "-80px" }}>
                        <Dropdown.Item
                          onClick={() => handleUserActive(user.id)}
                          style={{
                            color: "green",
                            fontSize: "18px",
                            marginBottom: "10px",
                          }}
                        >
                          Activate
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleUserDelete(user.id)}
                          style={{ color: "red", fontSize: "18px" }}
                        >
                          Delete User
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this user and all
          associated data?
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowModal(false)}>Cancel</button>
          <button onClick={confirmDelete}>Okay</button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal1} onHide={() => setShowModal1(false)} style={{ position: 'absolute' }}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          {/* Search bar */}
          <a style={{ color: 'white', textDecoration: 'none' }} href="https://user.butterfly.hurairaconsultancy.com/createCV"><button style={{ marginBottom: '10px', width: "118px", height: "43px", background: "#3F3D56", borderRadius: "10px", fontFamily: "Poppins" }}>Create CV</button></a>
          <br />
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search by name or phone number"
            value={searchQuery1}
            onChange={(e) => setSearchQuery1(e.target.value)}
            style={styles1.searchInput}
          />

          <div style={{ ...styles1.cvContainer, overflow: 'auto', maxHeight: '70vh' }}>
            {filteredCVs.length > 0 ? (
              filteredCVs.map((cv, index) => (
                <div key={index} style={styles1.cvCard}>
                  <img
                    src={`https://backend.butterfly.hurairaconsultancy.com/${cv.path}`}
                    alt={`${cv.fullname}'s profile`}
                    style={styles1.profileImage}
                  />
                  <div style={styles1.cvDetails}>
                    <p style={styles1.cvName}>{cv.fullname}</p>
                    <p style={styles1.cvPhone}>{cv.phoneNumber}</p>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="button"
                      style={{
                        padding: 0,
                        cursor: "pointer",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '30px',
                        width: '30px',
                        borderRadius: '50%',
                        border: "1px solid var(--rn-53-themes-net-silver, #C3C3C3)",
                        backgroundColor: 'white',
                        margin: '-5px'

                      }}
                    >
                      <FaEllipsisH color="rgba(0,0,0,.5)" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ left: '-80px' }}>
                      <Dropdown.Item onClick={() => handleCreateUser1(cv)} style={{ color: 'green', fontSize: '18px' }}>
                        Create User
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleUserDelete(cv.id)}
                        style={{ color: "red", fontSize: "18px" }}
                      >
                        Delete User
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ))
            ) : (
              <div style={styles1.noCvs}>No CVs available</div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm User Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={CV?.phoneNumber || ""}
            onChange={(e) => setCV({ ...CV, phoneNumber: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 20px",
              margin: "8px 0",
              display: "inline-block",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
              fontSize: "16px",
              background: "#f9f9f9",
              transition: "border 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #555")}
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setShowModal2(false)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleCreateUser(CV)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >{loading ? 'loading...' : 'Okay'}
          </button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  activeUsers: state.user.activeUsers,
  expiredUsers: state.user.expiredUsers,
});

const styles1 = {
  table: {
    width: "60%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#F5F5F5",
    textAlign: "left",
    padding: "12px",
    fontSize: "14px",
    color: "#999",
    borderBottom: "2px solid #E5E5E5",
  },
  tr: {
    borderBottom: "1px solid #E5E5E5",
  },
  nameEmailContainer: {
    display: "flex",
    flexDirection: "column",
    width: "15rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  name: {
    fontSize: "15px",
    color: "var(--rn-53-themes-net-mine-shaft, #333)",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontWeight: "500",
  },
  email: {
    color: "var(--rn-53-themes-net-dusty-gray, #979797)",
    fontSize: "13px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginLeft: "0",
    whiteSpace: "nowrap",
    fontWeight: "500",
  },
  td: {
    padding: "12px",
    fontSize: "15px",
    color: "#333",
    verticalAlign: "left",
    textAlign: "left",
  },
  images: {
    width: "50px",
    height: "50px",
    borderRadius: "5px",
    objectFit: "cover",
  },

  modal: {
    minWidth: '1500px',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  cvContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  cvCard: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    flexWrap: 'nowrap',
  },
  profileImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '15px',
  },
  cvDetails: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
  },
  cvName: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
  },
  cvPhone: {
    fontSize: '14px',
    color: 'gray',
  },
  noCvs: {
    textAlign: 'center',
    width: '100%',
  },

};


const formatStatus = (status) => {
  // Normalize the status to lowercase for comparison
  const normalizedStatus = status.toLowerCase();

  // Map statuses to their display values
  switch (normalizedStatus) {
    case 'unmarried':
      return 'Single';
    case 'single':
      return 'Single';
    case 'married':
      return 'Married';
    case 'gold':
      return 'Gold';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter for any other statuses
  }
};

const getStatusColor = (status) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'unmarried':
      return 'var(--rn-53-themes-net-malachite, #17C653)';
    case 'single':
      return 'var(--rn-53-themes-net-malachite, #17C653)';
    case 'married':
      return '#FFECEC';
    case 'gold':
      return '#000';
    default:
      return '#000'; // Default text color if none of the conditions match
  }
};

const getStatusBackground = (status) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'unmarried':
      return 'var(--rn-53-themes-net-hint-of-green, #DFFFEA)';
    case 'married':
      return '#4452FF';
    case 'gold':
      return '#FFDFA7';
    default:
      return '#fff'; // Default background color if none of the conditions match
  }
};

export default connect(mapStateToProps)(User);
