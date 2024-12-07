import React,{useState,useEffect} from "react";
import BioHeader from './biodata_header';
import BioFooter from './biodata_footer';
import styles from '../Styles/Bio_dataStyle/page2.module.css';

function BioDataPage2({ userData, style }) {
  const [images,setImages]=useState([]);

  useEffect(() => {
    if (userData?.dpImage) {
      setImages([userData.dpImage]);
    }
  }, [userData]);
  if (!userData) {
    return <div>Loading...</div>; 
  }
  

  return (
    <section className={styles.card} data-component style={style}>
      <BioHeader />
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.details}>
            <h2 className={styles.personName}>{userData.user.fullName}</h2>
            <div className={styles.sideInfo}>
              <p className={styles.intro}>
                {userData.user.comments || "No introduction available"}
              </p>
              <div className={styles.sideContent}>
                {images && images.length > 0 ? (
                  <img 
                    src={`https://backend.butterfly.hurairaconsultancy.com/${images[0]}`} alt="DP"
                    className={styles.profilePic}
                  />
                ) : (
                  <p>No profile image available</p>
                )}
              </div>
            </div>

            {/* Personal info */}
            <section className={styles.container}>
              <h2 className={styles.sectionTitle}>Personal Details:</h2>
              <div className={styles.sectionContent}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Date of Birth:</span>
                  <span className={styles.value}>
                    {`${userData.user.dobDay} ${userData.user.dobMonth} ${userData.user.dobYear}`}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Height:</span>
                  <span className={styles.value}>
                    {`${userData.user.heightFeet} feet ${userData.user.heightInches} inches`}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Gender:</span>
                  <span className={styles.value}>{userData.user.gender}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Blood Group:</span>
                  <span className={styles.value}>{userData.user.bloodGroup}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Physical Status:</span>
                  <span className={styles.value}>{userData.user.physicalStatus}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Religion:</span>
                  <span className={styles.value}>{userData.user.religion}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Marital Status:</span>
                  <span className={styles.value}>{userData.user.maritalStatus}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>NID Number:</span>
                  <span className={styles.value}>{userData.user.nidNumber}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Citizenship:</span>
                  <span className={styles.value}>{userData.user.citizenship}</span>
                </div>
              </div>
            </section>

            {/* Contact info */}
            <section className={styles.container}>
              <h2 className={styles.sectionTitle}>Contact Information:</h2>
              <div className={styles.sectionContent}>
                <p className={styles.detailItem}>
                  <span className={styles.label}>Phone:</span>
                  <span className={styles.value}>{userData.user.phoneNumber}</span>
                </p>
                <p className={styles.detailItem}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{userData.user.email}</span>
                </p>
              </div>
            </section>

            {/* Address */}
            <section className={styles.container}>
              <h2 className={styles.sectionTitle}>Present Address</h2>
              <div className={styles.address}>{userData.user.presentAddress}</div>
              <div className={styles.sectionContent}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>City:</span>
                  <span className={styles.value}>{userData.user.city}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Country:</span>
                  <span className={styles.value}>{userData.user.country}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Residence status:</span>
                  <span className={styles.value}>{userData.user.residenceStatus}</span>
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Permanent Address</h2>
              <div className={styles.address}>{userData.user.permanentAddress}</div>
              <div className={styles.sectionContent}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>City:</span>
                  <span className={styles.value}>{userData.user.permanentCity}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Country:</span>
                  <span className={styles.value}>{userData.user.permanentCountry}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Residence status:</span>
                  <span className={styles.value}>{userData.user.permanentResidenceStatus}</span>
                </div>
              </div>
            </section>

            {/* Educational Background */}
            <section className={styles.container}>
              <h2 className={styles.sectionTitle}>Educational Background:</h2>
              <div className={styles.value}>{userData.user.highestEducationInstitution}</div>
              <div className={styles.value}>
                {userData.user.highestEducationDegree} - {userData.user.highestEducationDepartment}
              </div>
              <div className={styles.value}>
                {userData.user.educationalQualification || "Details not available"}
              </div>
            </section>
          </div>
        </div>
      </div>
      <BioFooter />
    </section>
  );
}

export default BioDataPage2;
