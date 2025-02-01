import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/report.module.css";
import { connect } from 'react-redux';
import axiosInstance from "../AxiosInstance/axiosinstance";
import { Modal, Button, Dropdown, Toast } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { ImBin } from "react-icons/im";

function Report({ collapsed }) {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState('');
    const [showGallery, setShowGallery] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);
    const fetchReports = async () => {
        //console.log('dhoke')
        try {
            const response = await axiosInstance.get('/reports');
            setReports([...response.data].reverse());
        } catch (error) {
            setReports([])
            console.error('Error fetching reports:', error);
        }
    };
    const handleReportClick = (report) => {
        setSelectedReport(report);
        setShowModal(true);
        setAction('');
    };

    const handleActionSelect = (eventKey) => {
        setAction(eventKey);
    };
    const handleDelete = async (report) => {
        //console.log(report,"theese are report to be deleted")
        try {
            await axiosInstance.post('/deleteReport', {
                reportId: report.id,
                files: report.files
            });
            fetchReports();
            toast.success('Updated Successfully')
            
        } catch (error) {
            toast.error('Update Failed')
        } finally {
            setShowModal(false);
            setAction('');
        }
        
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post('/handleReport', {
                action,
                reportId: selectedReport.id,
                reportedId: selectedReport.reported
            });
            toast.success('Updated Successfully')
            fetchReports();
        } catch (error) {
            toast.error('Update Failed')
        } finally {
            setShowModal(false);
            setAction('');
        }
    };

    const handleImageClick = (image) => {
        setCurrentImage(image);
        setShowGallery(true);
    };

    const closeGallery = () => setShowGallery(false);
    return (
        <>
            <Sidebar />
            <div className={`${styles.content} ${collapsed ? styles.collapsed : ''}`}>
                <h1>Reports</h1>
                <div className={styles.reportContainer}>
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div
                                key={report.id}
                                className={styles.reportBox}
                                onClick={() => handleReportClick(report)}
                                style={{
                                    background: report.action_taken == '1' ? 'rgba(205, 254, 194, 1)' : 'rgba(254, 121, 104, .5)'
                                }}
                            >
                                {/* Delete Button */}
                                <div
                                    className={styles.deleteIcon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(report);
                                    }}
                                >
                                    <ImBin color="black" size={20} />
                                </div>
                                <br/>
                                {/* Report Content */}
                                <h2>{report.violenceType}</h2>
                                <p><strong>Details:</strong> {report.details}</p>
                                <p><strong>Actions Taken:</strong> {report.actions}</p>
                                <p><strong>Reported By:</strong>
                                    <span className={styles.avatar}>
                                        <img
                                            src={`https://backend.butterfly.hurairaconsultancy.com/${report.reporterImage}`}
                                            alt={report.reporterName}
                                        />
                                    </span>
                                    {report.reporterName}
                                </p>
                                <p><strong>Reported Against:</strong>
                                    <span className={styles.avatar}>
                                        <img
                                            src={`https://backend.butterfly.hurairaconsultancy.com/${report.reportedImage}`}
                                            alt={report.reportedName}
                                        />
                                    </span>
                                    {report.reportedName}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No reports available</p>
                    )}
                </div>

                {/* Modal for Report Details */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Report Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedReport && (
                            <>
                                <h2>{selectedReport.violenceType}</h2>
                                <p><strong>Details:</strong> {selectedReport.details}</p>
                                <p><strong>Actions Taken:</strong> {selectedReport.actions}</p>
                                <p><strong>Reported By:</strong>
                                    <span className={styles.avatar}>
                                        <img src={`https://backend.butterfly.hurairaconsultancy.com/${selectedReport.reporterImage}`} alt={selectedReport.reporterName} />
                                    </span>
                                    {selectedReport.reporterName}
                                </p>
                                <p><strong>Reported Against:</strong>
                                    <span className={styles.avatar}>
                                        <img src={`https://backend.butterfly.hurairaconsultancy.com/${selectedReport.reportedImage}`} alt={selectedReport.reportedName} />
                                    </span>
                                    {selectedReport.reportedName}
                                </p>
                                <div className={styles.imageGallery}>
                                    {selectedReport.files.split(',').map((image, index) => (
                                        <img
                                            key={index}
                                            src={`https://backend.butterfly.hurairaconsultancy.com/uploads/${image}`}
                                            alt={`Uploaded file ${index}`}
                                            onClick={() => handleImageClick(image)}
                                            className={styles.uploadedImage}
                                        />
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <Dropdown onSelect={handleActionSelect}>
                                        <Dropdown.Toggle
                                            variant="success"
                                            id="dropdown-basic"
                                            style={{
                                                backgroundColor: action === "Warn the user" ? 'yellow' : action === "Deactivate user" ? 'red' : '',
                                            }}
                                        >
                                            {action ? action : 'Select Action'}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="Warn the user">Warn the user</Dropdown.Item>
                                            <Dropdown.Item eventKey="Deactivate user">Deactivate user</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Gallery Modal for Full-Size Images */}
                <Modal show={showGallery} onHide={closeGallery} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Image Gallery</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={`https://backend.butterfly.hurairaconsultancy.com/uploads/${currentImage}`} alt="Gallery" className={styles.fullSizeImage} />
                    </Modal.Body>
                </Modal>

                {/* Toast for notifications */}
                <ToastContainer />
            </div>
        </>
    );
}

const mapStateToProps = (state) => ({
    collapsed: state.sidebar.collapsed,
});

export default connect(mapStateToProps)(Report);
