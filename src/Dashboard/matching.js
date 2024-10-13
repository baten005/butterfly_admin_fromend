import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/matching.module.css";
import { FaEllipsisH} from "react-icons/fa";
import { fetchMatchingUsers } from "../store/actions/matchingActions";
import { fetchProfileData } from "../store/actions/dashboardActions";
import { Dropdown,Modal } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from "../AxiosInstance/axiosinstance";

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options); // 'en-GB' for day-month-year format
};


function Matching({ collapsed, profile, male, female }) {
  const dispatch = useDispatch();

  const maleUsers = useSelector((state) => state.matching.male);
  const femaleUsers = useSelector((state) => state.matching.female);
  const profileUsers = useSelector((state) => state.dashboard.profile);

  useEffect(() => {
    dispatch(fetchMatchingUsers());
    dispatch(fetchProfileData());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredProfiles = profileUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) || user.matchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.matchPhone.includes(searchQuery)
  );

  const filteredMaleUsers = maleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.includes(searchQuery)
  );

  const filteredFemaleUsers = femaleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.includes(searchQuery)
  );

  const handleCancelMatch = async (id) => {
    try {
      const response = await axiosInstance.post(`/cancelMatch`, { id });  
      console.log(response) 
      if (response.status === 200 && response.data.success) {
        toast.success("Match cancelled successfully!");
        dispatch(fetchProfileData());
      } else {
        toast.error("Failed to cancel match.");
      }
    } catch (error) {
      toast.error("Error occurred while cancelling match.");
    }
  };

  const handleMatchUser = (user) => {
    setSelectedUser(user);
    const oppositeUsers = user.det === "male" ? femaleUsers : maleUsers;
    const filteredOppositeUsers = oppositeUsers.filter(oppositeUser => {
      return !profileUsers.some(profile => 
        (profile.one === user.id && profile.two === oppositeUser.id) || 
        (profile.two === user.id && profile.one === oppositeUser.id)
      );
    });
    setModalUsers(filteredOppositeUsers);
    setShowModal(true);
  };
  
  const [searchQuery1, setSearchQuery1] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalUsers, setModalUsers] = useState([]);
  const handleUserSelect = async (user) => {
    try {
      const response = await axiosInstance.post('/matchUsers', {
        userId: selectedUser.id,
        matchId: user.id,
      });
      if (response.status === 200 && response.data.success) {
        toast.success("Matched successfully!");
        dispatch(fetchProfileData());
      } else {
        toast.error("Failed to match user.");
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Error occurred while matching user.");
    }
  };

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <br />
        <br />
        <div className="input-group mb-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search Here"
            aria-label="Search Here"
            aria-describedby="basic-addon1"
            style={{ width: "80%", padding: "15px", background: "#E3E3E3" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <br />
        <br />
        <h2 className={styles.activeMatchTitle}>Active matches</h2>
        <p className={styles.activeMatchSubtitle}>Ongoing match</p>
        {/* Display Filtered Profile Matches */}
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, index) => (
            <div className={styles.row} key={index}>
            <div className={styles.idCell}>{profile.id}</div>
            <div className={styles.imageCell}>
              <img
                className={styles.personImage}
                src={"https://backend.butterfly.hurairaconsultancy.com/" + profile.image1}
                alt="Profile"
              />
            </div>
          
            <div className={styles.infoCell}>
              <div className={styles.name}>{profile.name}</div>
              <div className={styles.email}>{profile.email}</div>
            </div>
          
            <div className={styles.phoneCell}>{profile.phone}</div>
            <div className={styles.dateCell}>{formatDate(profile.date)}</div>

            <div className={styles.statusCell}>
              <span
                className={styles.status}
                style={{
                  color: getStatusColor(profile.status),
                  background: getStatusBackground(profile.status),
                }}
              >
                {formatStatus(profile.status)}
              </span>
            </div>

            <div className={styles.iconCell}>
              <img src={`${process.env.PUBLIC_URL}/send.svg`} style={{ cursor: "pointer" }} alt="send" />
            </div>
          
            <div className={styles.imageCell}>
              <img
                className={styles.personImage}
                src={"https://backend.butterfly.hurairaconsultancy.com/" + profile.image2}
                alt="Match"
              />
            </div>
            
            <div className={styles.matchInfoCell}>
              <div className={styles.name}>{profile.matchName}</div>
              <div className={styles.email}>{profile.matchEmail}</div>
            </div>
          
            <div className={styles.phoneCell}>{profile.matchPhone}</div>
            <div className={styles.dateCell}>{formatDate(profile.matchDate)}</div>
            <div className={styles.statusCell}>
              <span
                className={styles.status}
                style={{
                  color: getStatusColor(profile.matchStatus),
                  background: getStatusBackground(profile.matchStatus),
                }}
              >
                {formatStatus(profile.matchStatus)}
              </span>
            </div>


          
            <div className={styles.daysCell}>{profile.days}</div>

              <div style={styles1.cell1}>
                {/* Dropdown for options */}
                <Dropdown>
                  <Dropdown.Toggle
                    variant="button"
                    style={{
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                      border: "1px solid rgba(0,0,0,.4)",
                      backgroundColor: "white",
                      margin: "-5px",
                    }}
                  >
                    <FaEllipsisH color="rgba(0,0,0,.5)" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ left: "-80px" }}>
                    <Dropdown.Item
                      onClick={() => handleCancelMatch(profile.id)}
                      style={{ color: "red", fontSize: "18px" }}
                    >
                      Cancel Match
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
        ))
      ) : (
        <p>No matching profiles found</p>
      )}

        <br />
        <br />
        <div style={styles1.matchContainer}>
          <div
            className={{
              ...styles1.activeMembersContainer,
              border: "solid 1px rgba(0,0,0,.2)",
            }}
          >
            <h2 style={{ textAlign: "left", fontSize: "25px" }}>Male</h2>
            <p style={{ textAlign: "left", fontSize: "15px" }}>
              Unmatched Profile will be sorted first
            </p>

            {/* Display Filtered Male Users */}
            {filteredMaleUsers.length > 0 ? (
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
                  {filteredMaleUsers.map((user, index) => (
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
                      <td>
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
                      height: '40px', 
                      width: '40px',  
                      borderRadius: '50%', 
                      border: '1px solid rgba(0,0,0,.4)', 
                      backgroundColor: 'white', 
                      margin:'-5px'
                    }}
                  >
                    <FaEllipsisH color="rgba(0,0,0,.5)" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{left:'-80px'}}>
                    <Dropdown.Item onClick={() => handleMatchUser(user)} style={{ color: 'green',fontSize:'18px'}}>
                      Match User
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No matching male users found</p>
            )}
          </div>

          <br />

          <div className={styles1.activeMembersContainer}>
            <h2 style={{ textAlign: "left", fontSize: "25px" }}>Female</h2>
            <p style={{ textAlign: "left", fontSize: "15px" }}>
              Unmatched Profile will be sorted first
            </p>

            {/* Display Filtered Female Users */}
            {filteredFemaleUsers.length > 0 ? (
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
                  {filteredFemaleUsers.map((user, index) => (
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
                      <td className={styles.dateCell} >{formatDate(user.date)}</td>
                      <td>
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
                      height: '40px', 
                      width: '40px',  
                      borderRadius: '50%', 
                      border: '1px solid rgba(0,0,0,.4)', 
                      backgroundColor: 'white', 
                      margin:'-5px'
                    }}
                  >
                    <FaEllipsisH color="rgba(0,0,0,.5)" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{left:'-80px'}}>
                    <Dropdown.Item onClick={() => handleMatchUser(user)} style={{ color: 'green',fontSize:'18px'}}>
                      Match User
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No matching female users found</p>
            )}
          </div>
        </div>
        <br />
        <br />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select a User to Match</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search Here"
              value={searchQuery1}
              onChange={(e) => setSearchQuery1(e.target.value)}
            />
            {modalUsers.filter(user => user.name.toLowerCase().includes(searchQuery1.toLowerCase())).map((user, index) => (
              <div key={index} style={styles1.modalUser} onClick={() => handleUserSelect(user)}>
               <div> <img
                  style={styles1.personImage}
                  src={"https://backend.butterfly.hurairaconsultancy.com/" + user.image1}
                  alt={user.name}
                />
                {user.name}</div><br/>
              </div>
            ))}
          </Modal.Body>
        </Modal>
      <ToastContainer />
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  profile: state.dashboard.profile,
  male: state.matching.male,
  female: state.matching.female,
});
const styles1 = {
  modalUser:{
   
  },
  matchContainer: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },


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
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#333",
    verticalAlign: "left",
    textAlign: "left",
  },
  images: {
    width: "40px",
    height: "40px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  nameEmailContainer: {
    display: "flex",
    flexDirection: "column",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  name: {
    fontSize: "14px",
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  email: {
    color: "#999",
    fontSize: "12px",
    marginLeft: "0",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  activeMembersContainer: {
    padding: "10px",
    border: "solid 1px rgba(0,0,0,.9)",
    borderRadius: "5px",
    width: "50%",
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


export default connect(mapStateToProps)(Matching);
