import React from 'react';
import styles from '../Styles/Bio_dataStyle/bioData_header.module.css';

const BioHeader = () => {
return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.nameSection}>
                    <img src="/assets/leftHeader_cvdesign.svg" alt="Logo" className={styles.logo} />
                </div>
                <div className={styles.bioDataSection}>
                    <img src="/assets/bio_mid_header.svg" alt="Bio Data Logo" className={styles.bioDataLogo} />
                    <span className={styles.bioDataText}>Bio Data</span>
                </div>
                <aside className={styles.sideImage}>
                    <img src="/assets/rightHeader_cv.svg" alt="Additional Profile" className={styles.sideProfilePic} />
                </aside>
            </div>
        </header>
    );
};

export default BioHeader;