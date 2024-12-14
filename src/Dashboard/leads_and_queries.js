import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/leads.module.css"; // assuming you have the leads.module.css file
import { connect } from "react-redux";
import axiosInstance from "../AxiosInstance/axiosinstance";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { ImBin } from "react-icons/im";

function Leads_and_queries({ collapsed }) {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await axiosInstance.get("/getLeadsAndQueries");
            setLeads([...response.data].reverse());

        } catch (error) {
            console.error("Error fetching leads:", error);
        }
    };

    const handleLeadClick = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const handleDelete = async (lead) => {
        try {
            await axiosInstance.post("/delete_query", {
                id: lead.id,
            });
            toast.success("Deleted successfully!");
            fetchLeads();
        } catch (error) {
            toast.error("Failed to Delete");
        }
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post("/send_query_response", {
                phoneNumber: selectedLead.phoneNumber,
                message,
                id: selectedLead.id,
            });
            toast.success("Response sent successfully!");
            fetchLeads();
        } catch (error) {
            //console.log('eita')
            toast.error("Failed to send response");
        } finally {
            setShowModal(false);
            setMessage("");
        }
    };
    return (
        <>
            <Sidebar />
            <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>

                <h1 className={styles.title}>Leads and Queries</h1>
                <div className={styles.leadContainer}>
                    {leads.length > 0 ? (
                        leads.map((lead) => (
                            <div
                                key={lead.id}
                                className={styles.leadBox}
                                onClick={() => handleLeadClick(lead)}
                            >
                                <div onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleDelete(lead); 
                                }} className={styles.binIcon}>
                                    <ImBin color="red" />
                                </div>
                                <h2>{lead.name}</h2>
                                <p><strong>Phone:</strong> {lead.phoneNumber}</p>
                                <p><strong>Query:</strong> {lead.query}</p>
                            </div>

                        ))
                    ) : (
                        <p>No leads or queries available</p>
                    )}
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Respond to Query</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedLead && (
                            <>
                                <h2>{selectedLead.name}</h2>
                                <p><strong>Phone Number:</strong> {selectedLead.phoneNumber}</p>
                                <p><strong>Query:</strong> {selectedLead.query}</p>
                                <textarea
                                    className={styles.messageInput}
                                    placeholder="Type your response..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Send Response
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </div>
        </>
    );
}

const mapStateToProps = (state) => ({
    collapsed: state.sidebar.collapsed,
});

export default connect(mapStateToProps)(Leads_and_queries);
