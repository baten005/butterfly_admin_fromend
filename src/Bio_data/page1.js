import React from "react";
import styles from '../Styles/Bio_dataStyle/page1.module.css';

function BioDataPage1({ userData, style ,permission}) {
  const det=permission?false:true;
  if (!userData) {
    return <p>Loading...</p>; // Show a loading message or spinner while data is being fetched
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const formattedDOB = `${userData.user.dobDay} ${monthNames[parseInt(userData.user.dobMonth) - 1]} ${userData.user.dobYear}`;
  

  return (
    <main className={styles.container} data-component style={style}>
      <section className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.imageColumn}>
            <img 
              loading="lazy" 
              src="/assets/bio_designTop.svg" 
              className={styles.profileImage} 
              alt="Profile of Name"
            />
          </div>
          <div className={styles.logoColumn}>
            <img 
              loading="lazy" 
              src="/assets/butterfly_matrimony.png" 
              className={styles.logo} 
              alt="Logo"
            />
          </div>
        </div>
      </section>
      <section className={styles.bioSection}>
        <h1 className={styles.bioTitle}>Bio-Data</h1>
        <h2 className={styles.name}>{userData.user.fullName}</h2>
        <p className={styles.details}>
          Date of Birth: {formattedDOB} <br />
          {userData.user.city}, {userData.user.country}
        </p>
      </section>
      <div className={styles.decorativeColumn}>
        <img 
          loading="lazy" 
          src="/assets/bio_designBottom.svg" 
          className={styles.decorativeBar} 
          alt=""
        />
      </div>
    </main>
  );
}

export default BioDataPage1;
