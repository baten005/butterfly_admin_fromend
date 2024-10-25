import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/Dashboard.module.css";
import { fetchProfileData, fetchUserJoinStats } from "../store/actions/dashboardActions";
import { FaEllipsisH } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../AxiosInstance/axiosinstance";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options); // 'en-GB' for day-month-year format
};

const chartoptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Data',
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 100, // Increment by 100
        callback: function (value) {
          return value;
        },
      },
    },
  },
};
const Dashboard = ({ collapsed, data, profile }) => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState([]);
  const [lead, setLead] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    fetchTextReq();
    dispatch(fetchUserJoinStats());
  }, []);

  const fetchTextReq = async () => {
    try {
      const response = await axiosInstance.get(`/chatReqAvatars`);
      console.log(response, 'baler response dese');
      if (response.status === 200 && response.data) {
        //console.log(response.data);
        setAvatar(response.data.finalResults);
        setActiveUsers(response.data.totalUsers[0].total);
        setLead(response.data.totalqueries[0].total)
      } else {
        //console.log("error");
      }
    } catch (error) {
      //console.log(error, "Error occurred while cancelling match.");
    }
  };

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  const handleCancelMatch = async (id) => {
    try {
      const response = await axiosInstance.post(`/cancelMatch`, { id });
      //console.log(response);
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 12000,
      },
    },
  };
  console.log("theese are avatar", avatar);
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <h1 className={styles.maintitle}>Admin Dashboard</h1>
        <hr style={{ width: "100%" }} />
        <br />

        {/* First Div with all the smaller cards */}
        <div className={styles.firstRow}>
          <div className={styles.firstRow}>
            <div className={styles.firstDiv}>
              {/* Currently Active Users */}
              <div className={`${styles.dashboardCard} ${styles.activeUsers}`}>
                <div className={styles.liveIndicatorContainer}>
                  <h4>LIVE VISITORS</h4>
                  <div className={styles.liveIndicator}>
                    <div className={styles.slidingBar}></div>
                  </div>
                </div>
                <h2>Currently Active Users</h2>
                <p className={styles.number}>7</p>
                <p className={styles.cardBottomText}>
                  Currently 7 visitors survey in your website including you
                </p>
              </div>

              <Link
                to="/chat-requests"
                className={`${styles.dashboardCard} ${styles.chatRequest}`}
                style={{ padding: "0", alignContent: "center" }}
              >
                <div
                  className={`${styles.dashboardCard} ${styles.chatRequest}`}
                  style={{ boxShadow: 'none' }}
                >
                  <h2>Chat Request</h2>
                  <p className={styles.number}>{avatar.length}</p>
                  <div className={styles.avatars}>
                    {/* Display first 8 avatars */}
                    {avatar && avatar.length > 0 ? (
                      avatar.map((profile, index) => (
                        <div key={index}>
                          <img
                            src={`https://backend.butterfly.hurairaconsultancy.com/${profile.paths[0]}`}
                            alt={`User ${index + 1}`} // Updated alt text for better accessibility
                            className={styles.avatar}
                          />
                        </div>
                      ))
                    ) : (
                      <div></div> // Fallback content when there are no avatars
                    )}

                    {/* Display "+X" for remaining avatars */}
                    <div className={styles.remainingAvatars}>+1</div>
                  </div>
                </div>
              </Link>

              {/* User List */}
              <div className={`${styles.dashboardCard} ${styles.userList}`}>
                <h4>ALL USERS</h4>
                <h2>User List</h2>
                <p className={styles.number}>{activeUsers}</p>
                <p className={styles.cardBottomText}>List of all the users</p>
              </div>

              {/* Leads & Enquiry */}
              <Link
                to="/leads-and-enquries"
                className={`${styles.dashboardCard} ${styles.chatRequest}`}
                style={{ padding: "0", alignContent: "center" }}
              >
                <div className={`${styles.dashboardCard} ${styles.leadsEnquiry}`}>
                  <h2>Leads & Enquiry</h2>
                  <p className={styles.number}>{lead}</p>
                  <div className={styles.leads}>
                    {/* Display first 8 inquiries */}
                    {[...Array(Math.min(lead, 8))].map((_, index) => {
                      const randomAlphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Generates random uppercase letter
                      return (
                        <div key={index} className={styles.leadCircle}>
                          {randomAlphabet}
                        </div>
                      );
                    })}



                    {/* Display "+X" for remaining inquiries */}
                    {lead > 8 ? <div className={styles.remainingLeads}>{lead - 8}</div> : ''}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bar Chart on the Right */}
          <div className={`${styles.dashboardCard} ${styles.monthlyMembers}`}>
            <h3>Monthly Members</h3>
            <div className={styles.chart}>
              <Bar data={data} options={chartoptions} />
            </div>
          </div>
        </div>

        <br />
        <h2 className={styles.activeMatchTitle}>Active matches</h2>
        <p className={styles.activeMatchSubtitle}>Ongoing match</p>
        {profile.map((profile, index) => {
          return (
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
                      onClick={() => handleCancelMatch(profile.id)}
                      style={{ color: "red", fontSize: "18px" }}
                    >
                      Cancel Match
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          );
        })}
        <br />
        <br />
      </div>
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  data: state.dashboard.data,
  profile: state.dashboard.profile,
});

const styles1 = {
  cell1: {
    height: "30px",
    width: "30px",
    borderRadius: "60px",

    position: "relative",
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


export default connect(mapStateToProps)(Dashboard);
