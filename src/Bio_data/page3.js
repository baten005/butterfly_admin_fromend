// BioDataPage3.js

import React,{useState,useEffect} from "react";
import styles from '../Styles/Bio_dataStyle/page3.module.css'; // Ensure this CSS file exists and is correctly styled
import BioHeader from './biodata_header';
import Footer from './biodata_footer';

function BioDataPage3({ userData, style }) {

  const [brothers, setBrothers] = useState([]);
  const [sisters, setSisters] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (userData) {
      setBrothers(userData.brothers || []);
      setSisters(userData.sisters || []);
      setImages(userData.extraImage||[])
    }
  }, [userData]);
  if (!userData) {
    return <div>Loading...</div>; // Handle loading state
  }

  const {
    fullName,
    employedIn,
    currentProfessionCompany,
    currentProfessionTitle,
    currentProfessionDepartment,
    monthlyIncome,
    fatherName,
    fatherOccupation,
    motherName,
    motherOccupation,
    educationalQualification,
    employmentStatus,
    notReferredDistricts,
    district,
    age,
    height,
    heightPreference,
    preferredHeightLimit,
    agePreference,
    preferredAgeLimit
  } = userData.user;

  //console.log(images,userData,"this is the kakaest data")
  return (
    <div className={styles.card} data-component style={style}>
      <BioHeader />

      {/* Main Information Section */}
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h2 className={styles.personName}>{fullName}</h2>
          <h2 className={styles.sectionTitle}>Profession:</h2>
          <div className={styles.sectionContent}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Occupation Type:</span>
              <span className={styles.value}>{employedIn}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Institution Name:</span>
              <span className={styles.value}>{currentProfessionCompany}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Job Title:</span>
              <span className={styles.value}>{currentProfessionTitle}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Department:</span>
              <span className={styles.value}>{currentProfessionDepartment}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Monthly Income:</span>
              <span className={styles.value}>{monthlyIncome}</span>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Family Information:</h2>
          <div className={styles.sectionContent}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Father's Name:</span>
              <span className={styles.value}>{fatherName || "Father's Name"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Father's Occupation:</span>
              <span className={styles.value}>{fatherOccupation || "Father's Occupation"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Mother's Name:</span>
              <span className={styles.value}>{motherName || "Mother's Name"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Mother's Occupation:</span>
              <span className={styles.value}>{motherOccupation || "Mother's Occupation"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Number of Siblings:</span>
              <span className={styles.value}>
                  {brothers.length > 0 || sisters.length > 0
                    ? `${brothers.length} ${brothers.length === 1 ? 'Brother' : 'Brothers'} and ${sisters.length} ${sisters.length === 1 ? 'Sister' : 'Sisters'}`
                    : "0"}
                </span>
            </div>

            {/* Dynamic Brothers Information */}
            {brothers && brothers.length > 0 && (
              <>
                {brothers.map((brother, index) => (
                  <div key={index} className={styles.detailItem}>
                    <span className={styles.label}>Brother {index + 1} Name:</span>
                    <span className={styles.value}>{brother.brotherName || `Brother ${index + 1} Name`}</span>
                    <span className={styles.label}>Occupation:</span>
                    <span className={styles.value}>{brother.brotherOccupation || `Brother ${index + 1} Occupation`}</span>
                  </div>
                ))}
              </>
            )}

            {/* Dynamic Sisters Information */}
            {sisters && sisters.length > 0 && (
              <>
                {sisters.map((sister, index) => (
                  <div key={index} className={styles.detailItem}>
                    <span className={styles.label}>Sister {index + 1} Name:</span>
                    <span className={styles.value}>{sister.sisterName || `Sister ${index + 1} Name`}</span>
                    <span className={styles.label}>Occupation:</span>
                    <span className={styles.value}>{sister.sisterOccupation || `Sister ${index + 1} Occupation`}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Preference Section */}
          <section className={styles.sec3}>
            <h2 className={styles.sectionTitle}>Preference:</h2>
            <div className={styles.value}>
            I am looking for a person{" "}
                {(() => {
                  const items = [];

                  if (age && age !== "N/A") {
                    items.push(`age around ${age} years old`);
                  }
                  if (height && height !== "N/A") {
                    items.push(`height around ${height}`);
                  }
                  if (district && district !== "N/A") {
                    items.push(`from ${district}`);
                  }

                  if (items.length === 0) {
                    return ""; 
                  }

                  if (items.length === 1) {
                    return items[0];
                  }

                  const lastItem = items.pop(); 
                  return `${items.join(", ")} and ${lastItem}`; 
                })()} . 

                {(() => {
                  const qualifications = [];
                  
                  if (educationalQualification && educationalQualification !== "N/A") {
                    qualifications.push(educationalQualification);
                  }
                  if (employmentStatus && employmentStatus !== "N/A") {
                    qualifications.push(employmentStatus);
                  }

                  if (qualifications.length === 0) {
                    return ""; 
                  }

                  return (
                    <>
                      {qualifications.length === 1 
                        ? ` I am open for ${qualifications[0]} . ` 
                        : ` I am open for ${qualifications.join(" and ")} . `}
                    </>
                  );
                })()}

                {(() => {
                    const preferences = [];

                    if (agePreference && agePreference !== "N/A" && preferredAgeLimit && preferredAgeLimit !== "N/A") {
                      preferences.push(`age ${agePreference} ${preferredAgeLimit} years`);
                    }

                    if (heightPreference && heightPreference !== "N/A" && preferredHeightLimit && preferredHeightLimit !== "N/A") {
                      preferences.push(`height ${heightPreference} ${preferredHeightLimit}`);
                    }

                    if (notReferredDistricts && notReferredDistricts !== "N/A") {
                      preferences.push(`lives in ${notReferredDistricts}`);
                    }

                    if (preferences.length === 0) {
                      return ""; 
                    }

                    return (
                      <>
                      I may not prefer someone{" "}
                      {preferences.length === 1
                        ? preferences[0] 
                        : preferences.join(" or ")}
                      .
                    </>
                    );
                  })()}
              </div>


          </section>
          <div className={styles.extraItem}> 
              {images && images.length > 0 && (
                  <>
                    {images.map((image, index) => (
                      <div key={index}  >
                        <img src={`https://backend.butterfly.hurairaconsultancy.com/${image.path}`} className={styles.extraImages} />
                      </div>
                    ))}
                  </>
                )}
              </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BioDataPage3;
