import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/socialLinkUpdate.module.css"
import {
  fetchContactDetails,
  selectContact,
  updateContact,
} from "../store/actions/socialLinkUpdateActions";
import {
  Telephone,
  Envelope,
  GeoAlt,
  Whatsapp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "react-bootstrap-icons";


const styles1 = {
  container: {},
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#E9E6E8",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "40px",

    borderRadius: "15px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "8px",
    border: "1px solid #C5C5C5",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4E4B5C",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    
    borderRadius: "8px",
    backgroundColor: "#4E4B5C",
    color: "black",
    cursor: "pointer",
  },
  contactText: {
    fontSize: "14px",
    color: "#000",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10%",
    width: "40px",
    height: "40px",
    backgroundColor: "#4B3E7E",
    marginRight: "10px",
  },
  iconSection: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
};
function SocialLinkUpdate({
  collapsed,
  contactItem,
  companySocial,
  founderSocial,
  selected,
  loading_social,
  fetchContactDetails,
  selectContact,
  updateContact,
}) {
  const [companyInputValue, setCompanyInputValue] = useState("");
  const [founderInputValue, setFounderInputValue] = useState("");
  const [det, setdet] = useState("");

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);
  

  useEffect(() => {
    if (selected.type && selected.name) {
      if (
        selected.type === "contactItem" ||
        selected.type === "companySocial"
      ) {
        setCompanyInputValue(
          selected.name=='Whatsapp'?(selected.type=='contactItem'?contactItem[selected.name]:companySocial[selected.name]):(contactItem[selected.name] || companySocial[selected.name] || "")
        );
      } else if (selected.type === "founderSocial") {
        setFounderInputValue(founderSocial[selected.name] || "");
      }
    }
  }, [selected, contactItem, companySocial, founderSocial]);

  const handleIconClick = (type, name) => {
    selectContact(type, name);
  };

  const handleUpdate = (section) => {
    if (selected.type && selected.name) {
      const newValue =
        section === "company" ? companyInputValue : founderInputValue;
        console.log('dhoka')
        selected.type=='companySocial'?setdet('1'):setdet('2');
      updateContact(selected.type, selected.name, newValue);
    }
  };

  const renderContactStyle = (name) => ({
    ...styles1.contactItem,
    backgroundColor:
      selected.name === name && selected.type === "contactItem"
        ? "#007BFF"
        : "",
  });

  const renderIconStyle = (name, section) => ({
    ...styles1.iconWrapper,
    backgroundColor:
      selected.name === name && selected.type === section
        ? "#007BFF"
        : "#FFF",
  });
 console.log(loading_social,"jsnhxshxn")
  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <div style={styles1.container}>
          <section style={styles1.section}>
            <h1>Company Details</h1>

            <div
              style={renderContactStyle("Telephone")}
              onClick={() => handleIconClick("contactItem", "Telephone")}
            >
              <div style={styles1.iconWrapper}>
                <Telephone color="white" size={18} />
              </div>
              <div style={styles1.contactText}>{contactItem.Telephone}</div>
            </div>
            <div
              style={renderContactStyle("Whatsapp")}
              onClick={() => handleIconClick("contactItem", "Whatsapp")}
            >
              <div style={styles1.iconWrapper}>
                <Whatsapp color="white" size={18} />
              </div>
              <div style={styles1.contactText}>{contactItem.Whatsapp}</div>
            </div>
            <div
              style={renderContactStyle("Email")}
              onClick={() => handleIconClick("contactItem", "Email")}
            >
              <div style={styles1.iconWrapper}>
                <Envelope color="white" size={18} />
              </div>
              <div style={styles1.contactText}>{contactItem.Email}</div>
            </div>
            <div
              style={renderContactStyle("Location")}
              onClick={() => handleIconClick("contactItem", "Location")}
            >
              <div style={styles1.iconWrapper}>
                <GeoAlt color="white" size={18} />
              </div>
              <div style={styles1.contactText}>{contactItem.Location}</div>
            </div>

            {/* Company Social Links */}
            <div style={{ display: "flex" }}>
              {" "}
              <div
                style={renderIconStyle("Facebook", "companySocial")}
                onClick={() => handleIconClick("companySocial", "Facebook")}
              >
                <Facebook color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Twitter", "companySocial")}
                onClick={() => handleIconClick("companySocial", "Twitter")}
              >
                <Twitter color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Instagram", "companySocial")}
                onClick={() => handleIconClick("companySocial", "Instagram")}
              >
                <Instagram color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Linkedin", "companySocial")}
                onClick={() => handleIconClick("companySocial", "Linkedin")}
              >
                <Linkedin color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Whatsapp", "companySocial")}
                onClick={() => handleIconClick("companySocial", "Whatsapp")}
              >
                <Whatsapp color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Youtube", "companySocial")}
                onClick={() => handleIconClick("companySocial", "Youtube")}
              >
                <Youtube color="black" size={18} />
              </div>
            </div>

            {/* Company Input Field and Update Button */}
            <div style={styles1.inputWrapper}>
              <input
                style={styles1.input}
                value={companyInputValue}
                onChange={(e) => setCompanyInputValue(e.target.value)}
                placeholder="Update Company Info"
                className="form-control"
              />
              <button
                style={styles1.button}
                onClick={() => handleUpdate("company")}
                disabled={loading_social}
              >
                {loading_social && det=='1' ? "Loading..." : "Update"}
              </button>
            </div>
          </section>
          <br />
          <br />
          <section style={styles1.section}>
            <h1>Founder Social</h1>
            <div style={{ display: "flex" }}>
              <div
                style={renderIconStyle("Facebook", "founderSocial")}
                onClick={() => handleIconClick("founderSocial", "Facebook")}
              >
                <Facebook color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Twitter", "founderSocial")}
                onClick={() => handleIconClick("founderSocial", "Twitter")}
              >
                <Twitter color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Instagram", "founderSocial")}
                onClick={() => handleIconClick("founderSocial", "Instagram")}
              >
                <Instagram color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Linkedin", "founderSocial")}
                onClick={() => handleIconClick("founderSocial", "Linkedin")}
              >
                <Linkedin color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Whatsapp", "founderSocial")}
                onClick={() => handleIconClick("founderSocial", "Whatsapp")}
              >
                <Whatsapp color="black" size={18} />
              </div>
              <div
                style={renderIconStyle("Youtube", "founderSocial")}
                onClick={() => handleIconClick("founderSocial", "Youtube")}
              >
                <Youtube color="black" size={18} />
              </div>
            </div>

            <div style={styles1.inputWrapper}>
              <input
                style={styles1.input}
                value={founderInputValue}
                onChange={(e) => setFounderInputValue(e.target.value)}
                placeholder="Update Founder Social"
                className="form-control"
              />
              <button
                style={styles1.button}
                onClick={() => handleUpdate("founder")}
                
              >
                {loading_social && det=='2' ? "Loading..." : "Update"}
              </button>
            </div>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed:state.sidebar.collapsed,
  contactItem: state.contact.contactItem,
  companySocial: state.contact.companySocial,
  founderSocial: state.contact.founderSocial,
  selected: state.contact.selected,
  loading_social: state.contact.loading_social,
});

const mapDispatchToProps = {
  fetchContactDetails,
  selectContact,
  updateContact,
  
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialLinkUpdate);
