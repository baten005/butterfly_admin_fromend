import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import { connect } from "react-redux";
import styles from "../Styles/testimonial.module.css";
import { fetchTestimonials,deleteTestimonials} from "../store/actions/testimonialActions";
import TestimonialModal from "./TestimonialModal";

function Testimonial({ collapsed, testimonials, dispatch }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const openModal = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTestimonial(null);
    setModalOpen(false);
  };

  const TestimonialCard = ({ content, name, designation, company, imageSrc,id }) => (
    <div className={styles.cardContainer} key={id} style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      <div className={styles.cardContent} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={`${imageSrc}`}
          alt={`${name} - ${designation} at ${company}`}
          className={styles.authorImage}
        />
        <div>
          <p className={styles.testimonialText} style={{ marginBottom: "0", paddingBottom: "0" }}>
            {content}
          </p>
          <h3 className={styles.authorName} style={{ margin: "5px 0 0 0", padding: "0" }}>
            {name}
          </h3>
          <p className={styles.authorInfo} style={{ margin: "0", padding: "0" }}>
            {designation}, {company}
          </p>
        </div>
      </div>
      <div className={styles.buttonContainer} style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: 'end' }}>
        <button className="btn btn-primary" style={{ width: "100px" }} onClick={() => openModal({ content, name, designation, company, imageSrc,id })}>Edit</button>
        <button className="btn btn-danger" style={{ width: "100px" }} onClick={()=>dispatch(deleteTestimonials(id))}>Delete</button>
      </div>
    </div>
  );

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <button className="btn btn-primary" style={{ marginBottom: "10px", width: "100px" }} onClick={() => openModal(null)}>Add New</button>
        <div className={styles.cardListContainer}>
          <div className={styles.testimonialList}>
            {testimonials.map((testimonial, index) => (
              <><TestimonialCard key={index} {...testimonial} /><br/><br/><br/></>
            ))}
          </div>
        </div>
      </div>
      <TestimonialModal isOpen={modalOpen} onClose={closeModal} existingTestimonial={currentTestimonial} />
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  testimonials: state.testimonials.testimonials,
});

export default connect(mapStateToProps)(Testimonial);
