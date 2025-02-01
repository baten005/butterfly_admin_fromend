import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../AxiosInstance/axiosinstance';
import styles from '../Styles/profilePreview.module.css';
import BioDataPage1 from '../Bio_data/page1';
import BioDataPage2 from '../Bio_data/page2';
import BioDataPage3 from '../Bio_data/page3';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DNA } from 'react-loader-spinner';

function ProfileView() {
    const location = useLocation();
    const { userId } = location.state || {};
    const id = userId;
    const [userData, setUserData] = useState(null);
    const [marginBottomStyle, setMarginBottomStyle] = useState({});
    const biodataRef = useRef(null);  // Reference for the biodata pages
    const [loading, setLoading] = useState(false);

    // Fetch user data from API
    useEffect(() => {
        //console.log("Fetching data for id:", id);
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${userId}`);
                //console.log(response.data, "User data fetched");
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (id) fetchData();
    }, [id]);

    useEffect(() => {
        const updateMarginBottomStyle = () => {
            setMarginBottomStyle(window.innerWidth <= 768 ? { marginBottom: '-240px' } : {});
        };

        updateMarginBottomStyle();
        window.addEventListener('resize', updateMarginBottomStyle);

        return () => window.removeEventListener('resize', updateMarginBottomStyle);
    }, []);

    // Generate PDF on Print Button Click
    const handlePrint = async () => {
        if (!biodataRef.current) return;
        setLoading(true);
        const pdf = new jsPDF("p", "mm", "a4");
        const pages = biodataRef.current.children;

        for (let i = 0; i < pages.length; i++) {
            const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }
        setLoading(false);
        pdf.save(`${userData?.user?.fullName || 'Profile'}.pdf`);
        
    };

    return (
        <main className={styles.userDashboard}>
            <div className={styles.profileViewContainer}>
                <Link to="/user" className={styles.profileViewingText}>&lt; Profile Viewing</Link>
                <div className={styles.headerSection}>
                    <div className={styles.biopreview} ref={biodataRef}>
                        <BioDataPage1 userData={userData} style={marginBottomStyle} />
                        <BioDataPage2 userData={userData} style={marginBottomStyle} />
                        <BioDataPage3 userData={userData} style={marginBottomStyle} />
                    </div>
                    <div className={styles.actionIcons}>
                        <button className={styles.print} onClick={handlePrint}>
                            <img src={`${process.env.PUBLIC_URL}/assets/print.svg`} alt="Print" />
                        </button>
                    </div>
                </div>
            </div>
            {loading && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.loaderContainer}>
                        <DNA color="#00BFFF" height={80} width={80} />
                    </div>
                </div>)}
        </main>
    );
}

export default ProfileView;
