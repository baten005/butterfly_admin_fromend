import React, { useState, useRef, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Sidebar from "../Components/sidebar";
import styles from "../Styles/introSec1.module.css";
import imageCompression from "browser-image-compression";
import { updateLandingImage, getText, updateText } from "../store/actions/homePageImageActions";

function HomePageImage({ collapsed, image, text }) {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(image.image);
  const [editedImage, setEditedImage] = useState(null);
  const [inputText, setInputText] = useState(text.text || ""); // State to manage input text
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getText());
  }, [dispatch]);

  const scrollToImage = () => {
    if (imageRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToFileInput = () => {
    if (fileInputRef.current) {
      ////console.log("Scrolling to file input...");
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);
        scrollToImage();
        handleImageSave(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSave = async (file) => {
    if (!file) return;

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], "image.webp", {
        type: "image/webp",
      });
      setEditedImage(compressedFile);

      const userConfirmed = window.confirm("Do you want to keep this image?");
      if (userConfirmed) {
        setSelectedImage(compressedFile);
        dispatch(updateLandingImage(compressedFile));
      } else {
        setImagePreview(`https://backend.butterfly.hurairaconsultancy.com/uploads/landingCoverImage.webp`);
        scrollToFileInput();
      }
    } catch (error) {
      console.error("Error while compressing the image", error);
    }
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value); 
  };

  const handleUpdateText = () => {
    dispatch(updateText(inputText)); 
  };

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.container}>
          <img
            className={styles.top_cover}
            src={imagePreview}
            alt="Cover"
            ref={imageRef}
            loading="lazy"
          />
          <section className={styles.intro}>
            <div className={styles.introframe}>
              <div className={styles.intro_upper}>
                <div className={styles.intro_heading}>Butterfly Matrimony</div>
                <div className={styles.subheading_intro}>
                  Your perfect matchmaker
                </div>
              </div>
              <div className={styles.matrimony_desc}><p style={{fontSize:'20px'}}>{text.text}</p></div>
              <div className={styles.intro_footer}>
                <span className={styles.footer_spn}>#1</span> MATRIMONY
              </div>
            </div>
          </section>
        </div>
        <br />
        <br />
        <div style={{ textAlign: "center" }} ref={fileInputRef}>
          <div style={{ ...style1.formDiv }}>
            <label
              htmlFor="file-upload"
              className="custom-file-upload"
              style={style1.lvl}
            >
              + Add Image
            </label>
            <span style={style1.span}>
              Recommended: Webp, file size not more than 300kb
            </span>
            <input
              id="file-upload"
              type="file"
              style={style1.input}
              accept=".jpg, .jpeg, .png, .webp"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <br />
        <br />
        <br />
        <div style={{ textAlign: "center" }}>
          <div style={{ ...style1.formDiv1 }}>
            <label
              htmlFor="text-upload"
              className="text-upload"
              style={{ float: "left" }}
            >
              Text
            </label>
            <br />
            <textarea
              className="form-control"
              id="text-upload"
              style={{ ...style1.formDiv2 }}
              value={inputText}
              onChange={handleTextChange}
              
            />
            <button
              style={style1.updateButton} 
              onClick={handleUpdateText}
            >
              Update
            </button>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  image: state.homePageImage.image,
  text: state.homePageImage.text,
});

const style1 = {
  formDiv: {
    width: "70%",
    background: "#D9D9D9",
    margin: "auto",
    padding: "20px 0px",
    textAlign: "left",
    borderRadius: "10px",
  },
  formDiv1: {
    width: "70%",
    margin: "auto",
    position: "relative",
    borderRadius: "10px",
  },
  formDiv2: {
    width: "100%",
    background: "#D9D9D9",
    margin: "auto",
    padding: "20px 20px",
    textAlign: "left",
    border: "none",
    borderRadius: "10px",
    minHeight: "200px",
  },
  lvl: {
    background: "black",
    color: "white",
    padding: "5px 36px",
    borderRadius: "5px",
    marginLeft: "45px",
    cursor: "pointer",
  },
  span: {
    color: "#000",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "17px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "30px",
  },
  input: {
    display: "none",
  },
  updateButton: {
    marginTop: "10px",
    background: "#3F3D56",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    float: "right",
  },
};

export default connect(mapStateToProps)(HomePageImage);
