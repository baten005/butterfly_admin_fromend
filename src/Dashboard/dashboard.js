import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/Dashboard.module.css";
import { fetchProfileData } from "../store/actions/dashboardActions";
import { FaEllipsisH, FaPaperPlane } from "react-icons/fa";
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

const Dashboard = ({ collapsed, data, profile }) => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState([]);

  useEffect(() => {
    fetchTextReq();
  }, []);

  const fetchTextReq = async () => {
    try {
      const response = await axiosInstance.get(`/chatReqAvatars`);
      console.log(response);
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setAvatar(response.data);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error, "Error occurred while cancelling match.");
    }
  };

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  const handleCancelMatch = async (id) => {
    try {
      const response = await axiosInstance.post(`/cancelMatch`, { id });
      console.log(response);
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
        <h1>Admin Dashboard</h1>
        <hr style={{ width: "100%" }} />
        <br />

        {/* First Div with all the smaller cards */}
        <div className={styles.firstRow}>
          <div className={styles.firstRow}>
            <div className={styles.firstDiv}>
              {/* Currently Active Users */}
              <div className={`${styles.dashboardCard} ${styles.activeUsers}`}>
                <h4>LIVE VISITORS</h4>
                <h2>Currently Active Users</h2>
                <p className={styles.number}>7</p>
                <p>Currently 7 visitors survey in your website including you</p>
              </div>

              <Link
                to="/chat-requests"
                className={`${styles.dashboardCard} ${styles.chatRequest}`}
                style={{ padding: "0", alignContent: "center" }}
              >
                <div
                  className={`${styles.dashboardCard} ${styles.chatRequest}`}
                  style={{boxShadow:'none'}}
                >
                  <h2>Chat Request</h2>
                  <p className={styles.number}>{avatar.length}</p>
                  <div className={styles.avatars}>
                    {/* Display first 8 avatars */}
                    {avatar.map((profile, index) => (
                      <div key={index}>
                        <img
                          src={`https://backend.butterfly.hurairaconsultancy.com/${profile.paths[0]}`}
                          alt="User 1"
                          className={styles.avatar}
                        />
                      </div>
                    ))}
                    {/* Display "+X" for remaining avatars */}
                    <div className={styles.remainingAvatars}>+1</div>
                  </div>
                </div>
              </Link>

              {/* User List */}
              <div className={`${styles.dashboardCard} ${styles.userList}`}>
                <h4>ALL USERS</h4>
                <h2>User List</h2>
                <p className={styles.number}>69</p>
                <p>List off all the users</p>
              </div>

              {/* Leads & Enquiry */}
              <div className={`${styles.dashboardCard} ${styles.leadsEnquiry}`}>
                <h2>Leads & Enquiry</h2>
                <p className={styles.number}>28</p>
                <div className={styles.leads}>
                  {/* Display first 8 inquiries */}
                  <span className={styles.leadCircle}>A</span>
                  <span className={styles.leadCircle}>J</span>
                  <span className={styles.leadCircle}>B</span>
                  <span className={styles.leadCircle}>E</span>
                  <span className={styles.leadCircle}>B</span>
                  <span className={styles.leadCircle}>U</span>
                  <span className={styles.leadCircle}>M</span>
                  <span className={styles.leadCircle}>X</span>
                  {/* Display "+X" for remaining inquiries */}
                  <span className={styles.remainingLeads}>+5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart on the Right */}
          <div className={`${styles.dashboardCard} ${styles.monthlyMembers}`}>
            <h3>Monthly Members</h3>
            <div className={styles.chart}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        <br />
        <h2 style={{ textAlign: "left", fontSize: "25px" }}>Active matches</h2>
        <p style={{ textAlign: "left", fontSize: "15px" }}>Ongoing match</p>
        {profile.map((profile, index) => {
          return (
            <div style={styles1.row} key={index}>
              <div style={styles1.cell}>{profile.id}</div>
              <div style={styles1.cell}>
                <img
                  style={styles1.personImage}
                  src={"https://backend.butterfly.hurairaconsultancy.com/" + profile.image1}
                  alt="Profile"
                />
                <div>
                  <div>{profile.name}</div>
                  <div>{profile.email}</div>
                </div>
              </div>
              <div style={styles1.cell}>{profile.phone}</div>
              <div style={styles1.cell}>{profile.date}</div>
              <div style={styles1.cell}>
                <span style={{ ...styles1.status(profile.status) }}>
                  {profile.status}
                </span>
              </div>
              <FaPaperPlane
                color="red"
                style={{ marginRight: "30px", marginLeft: "20px" }}
              />
              <div style={styles1.cell}>
                <img
                  style={styles1.personImage}
                  src={"https://backend.butterfly.hurairaconsultancy.com/" + profile.image2}
                  alt="Match"
                />
                <div>
                  <div>{profile.matchName}</div>
                  <div>{profile.matchEmail}</div>
                </div>
              </div>
              <div style={styles1.cell}>{profile.matchPhone}</div>
              <div style={styles1.cell}>{profile.matchDate}</div>
              <div style={styles1.cell}>
                <span style={{ ...styles1.status(profile.matchStatus) }}>
                  {profile.matchStatus}
                </span>
              </div>
              <div style={styles1.cell}>{profile.days}</div>
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
  row: {
    display: "flex",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },
  personImage: {
    marginRight: "10px",
    width: "40px",
    height: "40px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  cell1: {
    height: "30px",
    width: "30px",
    borderRadius: "60px",
    borderColor: "rgba(0,0,0,.4)",
    border: "solid 1px",
    position: "relative",
  },
  status: (status) => ({
    padding: "5px 10px",
    borderRadius: "20px",
    color: "#fff",
    marginLeft: "0",
    backgroundColor: userStatusColor(status),
  }),
};

function userStatusColor(status) {
  switch (status) {
    case "Single":
      return "#36C3FF";
    case "Married":
      return "#5A72FF";
    case "Gold":
      return "#FFC107";
    default:
      return "#ccc";
  }
}

export default connect(mapStateToProps)(Dashboard);
