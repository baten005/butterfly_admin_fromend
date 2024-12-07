import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../AxiosInstance/axiosinstance';
import styles from '../Styles/profilePreview.module.css';
import BioDataPage1 from '../Bio_data/page1';
import BioDataPage2 from '../Bio_data/page2';
import BioDataPage3 from '../Bio_data/page3';

function ProfileView() {
    const location = useLocation();
    const {userId} = location.state || {}; 
    const id=userId;
    const [userData, setUserData] = useState(null);
    const [marginBottomStyle, setMarginBottomStyle] = useState({});
//console.log(id,isLiked,chatRequested,"ki re vai kaj kore na knn")
    // Fetch user data from API
    useEffect(() => {
        console.log("dhokar age id",id)
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${userId}`);
                console.log(response.data, "User data fetched");
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


    return (
        <main className={styles.userDashboard}>
            <div className={styles.profileViewContainer}>
                <Link to="/user" className={styles.profileViewingText}>&lt; Profile Viewing</Link>
                <div className={styles.headerSection}>
                    <div className={styles.biopreview}>
                        <BioDataPage1 userData={userData} style={marginBottomStyle} />
                        <BioDataPage2 userData={userData} style={marginBottomStyle} />
                        <BioDataPage3 userData={userData} style={marginBottomStyle} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProfileView;
