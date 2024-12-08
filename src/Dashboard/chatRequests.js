import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import { connect } from "react-redux";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaRegComment,
  FaEllipsisH,
} from "react-icons/fa"; // Import heart and chat icons
import { Dropdown } from "react-bootstrap";
import styles from "../Styles/testimonial.module.css";
import axiosInstance from "../AxiosInstance/axiosinstance";
import { toast,ToastContainer } from "react-toastify";

function ChatRequests({ collapsed }) {
  const [profileUsers, setProfileUsers] = useState([]);
  const [profileUsers1, setProfileUsers1] = useState([]);

  useEffect(() => {
    getChatReqs();
  }, []);

  const getChatReqs = async () => {
    try {
      const response = await axiosInstance.get(`/getChatReqs`);
      //console.log("dekhajak", response);
      if (response.status === 200 && response.data) {
        setProfileUsers(response.data.finalResults);
        setProfileUsers1(response.data.chatReqResults);
      } else {
        //console.log("error");
      }
    } catch (error) {
      //console.log(error, "error");
    }
  };

  const acceptChatReqs = async (match_id) => {
    try {
      const response = await axiosInstance.post(`/acceptChatReqs`,{
        match_id
      });
      //console.log("dekhajak", response);
      if (response.status === 200 && response.data) {
         toast.success(response.data.message);
         getChatReqs();
      } else {
        //console.log("error");
        toast.success(response.data.message)
      }
    } catch (error) {
      //console.log(error, "error");
      toast.error('Failed to Update')
    }
  };

  const cancelChatReqs = async (match_id) => {
    try {
      const response = await axiosInstance.post(`/cancelChatReqs`,{
        match_id
      });
      //console.log("dekhajak", response);
      if (response.status === 200 && response.data) {
        toast.success(response.data.message);
        getChatReqs();
      } else {
        //console.log("error");
        toast.success(response.data.message)
      }
    } catch (error) {
      //console.log(error, "error");
      toast.error('Failed to Update')
    }
  };
  //console.log(profileUsers)

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        {profileUsers && profileUsers.length > 0 ? (
          profileUsers.map((profile, index) => (
            <div style={{...styles1.row,background:profileUsers1[index].chatting_status=='1'?'rgba(205, 254, 194, 1)':'rgba(254, 121, 104, .5)'}} key={index}>
              {/* User One Details */}
              <div style={{...styles1.cell,justifyContent:'start'}}>
                <img
                  style={styles1.personImage}
                  src={"https://backend.butterfly.hurairaconsultancy.com/" + profile.user_one.paths[0]}
                  alt={profile.user_one.userId}
                />
                <div>
                  <div>{profile.user_one.name}</div>{" "}
                  {/* Assuming userId is the name for display */}
                  <div>{profile.user_one.number}</div>{" "}
                  {/* Replace with actual phone number field */}
                </div>
              </div>

              {/* Icons based on chat request and interest */}
              <div style={{...styles1.cell,justifyContent:'end'}} >
                {profileUsers1[index].user_one_chat_req ? (
                  <FaComment color="green" />
                ) : (
                  <FaRegComment color="red" />
                )}
                <div style={{ width: "10px" }} />
                {profileUsers1[index].user_one_interest ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart color="black" />
                )}
              </div>

              <div
                style={{
                  borderLeft: "1px solid #ccc", 
                  height: "50px", 
                  margin: "0 10px",
                }}
              />

              {/* Icons based on chat request and interest */}
              <div style={styles1.cell}>
                {profileUsers1[index].user_two_chat_req ? (
                  <FaComment color="green" />
                ) : (
                  <FaRegComment color="red" />
                )}
                <div style={{ width: "10px" }} />
                {profileUsers1[index].user_two_interest ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart color="black" />
                )}
              </div>
              {/* User Two Details */}
              <div style={styles1.cell}>
                <img
                  style={styles1.personImage}
                  src={"https://backend.butterfly.hurairaconsultancy.com/" + profile.user_two.paths[0]}
                  alt={profile.user_two.userId}
                />
                <div>
                  <div>{profile.user_two.name}</div>{" "}
                  {/* Assuming userId is the name for display */}
                  <div>{profile.user_two.number}</div>{" "}
                  {/* Replace with actual phone number field */}
                </div>
              </div>

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
                    onClick={() => acceptChatReqs(profileUsers1[index].match_id)}
                    style={{ color: "green", fontSize: "18px" }}
                  >
                    Accept Chat
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => cancelChatReqs(profileUsers1[index].match_id)}
                    style={{ color: "red", fontSize: "18px" }}
                  >
                    Cancel Chat
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))
        ) : (
          <p>No matching profiles found</p>
        )}
      </div>
      <ToastContainer/>
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  testimonials: state.testimonials.testimonials,
});

const styles1 = {
  modalUser: {},
  matchContainer: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },

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
  email: {
    color: "#999",
    fontSize: "12px",
    marginLeft: "0",
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
  },
  status: (status) => ({
    padding: "5px 10px",
    borderRadius: "20px",
    color: "#fff",
    marginLeft: "0",
  }),
};

export default connect(mapStateToProps)(ChatRequests);
