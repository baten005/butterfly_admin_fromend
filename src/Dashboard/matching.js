import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/matching.module.css";
import { FaEllipsisH } from "react-icons/fa";
import { fetchMatchingUsers } from "../store/actions/matchingActions";
import { fetchProfileData } from "../store/actions/dashboardActions";
import { Dropdown, Modal } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from "../AxiosInstance/axiosinstance";
import { Link, useLocation } from "react-router-dom";


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
      ////console.log(response) 
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

  const handleDeleteMatch = async (id) => {
    try {
      const response = await axiosInstance.post(`/deleteMatch`, { id });
      ////console.log(response) 
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

  const formatMatchStat = (profile) => {

    if (profile) {
      if (profile.chatting_status == '1')
        return 'Chatting Stage'
      else if (profile.user_one_view == '1')
        return `${profile.name} viewed`
      else if (profile.user_two_view == '1')
        return `${profile.matchName} viewed`
      else if (profile.user_one_view == '0' && profile.user_two_view == '0')
        return `None Viewed`
      else return `Both Viewed`
    }
  }

  const handleMatchUser = (user) => {
    setSelectedUser(user);
    const oppositeUsers = user.det.toLowerCase() === "male" ? femaleUsers : maleUsers;
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
  //console.log(filteredProfiles, "ki re vai hudai");
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
            style={{ width: "80%", padding: "15px", background: "#E3E3E3", borderRadius: "10px" }}
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
            <div
              className={`${styles.row}`}
              key={index}
            >
              <div
              className={`${profile.admin_block != '0' ? styles.blocked : ''}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: profile.interested == profile.one ? 'rgba(254, 121, 104, .6)' : 'transparent',
                  borderRadius: '20px'
                }}
              >

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
              </div>
              <div className={`${styles.iconCell} ${profile.admin_block != '0' ? styles.blocked : ''}`}>
                <img src={`${process.env.PUBLIC_URL}/send.svg`} style={{ cursor: "pointer" }} alt="send" />
              </div>
              <div
              className={`${profile.admin_block != '0' ? styles.blocked : ''}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: profile.interested == profile.two ? 'rgba(254, 121, 104, .5)' : 'transparent',
                  borderRadius: '20px'
                }}
              >

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



                <div className={styles.daysCell}>{profile.days} <br /><span>{formatMatchStat(profile)}</span></div>
              </div>
              <div style={styles1.cell1} >
                {/* Dropdown for options */}
                <Dropdown className={styles.neverBlock}>
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
                      margin: '-5px',
                      filter:'none'
                    }}
                  >
                    <FaEllipsisH color="rgba(0,0,0,.5)" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ left: "-80px" }}>
                    <Dropdown.Item
                      onClick={() => handleCancelMatch(profile.id)}
                      className={styles.neverBlock}
                      style={{ color: profile.admin_block == '0' ? "rgba(255, 240, 0)" : "#2ecc71", fontSize: "18px" }}
                    >
                      {profile.admin_block == '0' ? 'Block Match' : 'Unblock Match'}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDeleteMatch(profile.id)}
                      className={styles.neverBlock}
                      style={{ color: "rgba(254, 121, 104, 1)", fontSize: "18px" }}
                    >
                      Delete Match
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
          <div style={styles1.activeMembersContainer}>
            <h2 style={{ textAlign: "left", fontSize: "25px", marginBottom: "10px" }}>Male</h2>
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
                            <Dropdown.Item
                              style={{
                                color: "green",
                                fontSize: "18px",
                                marginBottom: "10px",
                              }}
                            ><Link to="/user_profile" state={{ userId: user.id }} >View Profile</Link>

                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMatchUser(user)} style={{ color: 'green', fontSize: '18px' }}>
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

          <div style={styles1.activeMembersContainer}>
            <h2 style={{ textAlign: "left", fontSize: "25px", marginBottom: "10px" }}>Female</h2>
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
                            <Dropdown.Item
                              style={{
                                color: "green",
                                fontSize: "18px",
                                marginBottom: "10px",
                              }}
                            ><Link to="/user_profile" state={{ userId: user.id }} >View Profile</Link>

                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMatchUser(user)} style={{ color: 'green', fontSize: '18px' }}>
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
                {user.name}</div><br />
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

  matchContainer: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    gap: "10px",
  },


  table: {
    width: "100%",
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
    fontSize: "13px",
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
  nameEmailContainer: {
    display: "flex",
    flexDirection: "column",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  name: {
    fontSize: "15px",
    fontWeight: "500",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  email: {
    fontWeight: "500",
    color: "#999",
    fontSize: "13px",
    marginLeft: "0",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  activeMembersContainer: {
    width: "100%",
  },

  blocked:{
    filter: 'grayscale(1)',
    opacity: .7
  }
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
