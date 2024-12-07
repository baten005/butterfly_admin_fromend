import React from 'react';
import styles from '../Styles/Bio_dataStyle/bioData_footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerImage}>
          <img src="/assets/leftBottom_cv.svg" alt="" className={styles.footerLogo} />
        </div>
        <div className={styles.footerText}>
          <div className={styles.poweredBy}>
            <img src="/assets/butterfly_cv.svg" alt="Butterfly Matrimonial Logo" className={styles.butterflyLogo} />
            <p>Powered By Butterfly Matrimonial | Visit: www.butterflymatrimonial.com</p>
          </div>
        </div>
        <div className={styles.footerImage}>
          <img src="/assets/rightBottom_cv.svg" alt="" className={styles.footerLogo} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;