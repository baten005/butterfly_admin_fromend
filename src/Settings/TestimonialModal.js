import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useDispatch } from "react-redux";
import styles from "../Styles/testimonial.module.css";
import { addTestimonial, updateTestimonial } from "../store/actions/testimonialActions";
import { RxCross1 } from "react-icons/rx";

export const convertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            const webpFile = new File([blob], "image.webp", { type: "image/webp" });
            resolve(webpFile);
          },
          "image/webp"
        );
      };
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const TestimonialModal = ({ isOpen, onClose, existingTestimonial }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    content: "",
    name: "",
    designation: "",
    company: "",
    image: null,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (existingTestimonial) {
      setFormData({
        content: existingTestimonial.content || "",
        name: existingTestimonial.name || "",
        designation: existingTestimonial.designation || "",
        company: existingTestimonial.company || "",
        image: null,
      });
    }
  }, [existingTestimonial]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob((blob) => {
      const webpFile = new File([blob], "image.webp", { type: "image/webp" });
      setFormData({ ...formData, image: webpFile });
      setImageSrc(null); 
      setIsCropping(false);
    }, "image/webp");
  }, [croppedAreaPixels, imageSrc, formData]);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.src = url;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingTestimonial) {
      dispatch(updateTestimonial({ ...formData, id: existingTestimonial.id }));
    } else {
      dispatch(addTestimonial(formData));
    }
    onClose();
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null); 
  };

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ""}`}>
      <div className={styles.modalContent}>
        <div style={{ textAlign: 'right' }}>
          <RxCross1 onClick={onClose} size={30} style={{ cursor: "pointer" }} />
        </div>
        <br />
        <form onSubmit={handleSubmit}>
          {!isCropping &&
            <>
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Content"
                required
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Designation"
                required
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company"
                required
              />
            </>
          }
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "block" }}
          />
          {isCropping && (
            <div className={styles.cropContainer}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                minZoom={.5} 
                maxZoom={10} 
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropSize={{ width: 300, height: 300 }}
                style={{ containerStyle: { width: "100%", height: "400px", position: "relative" } }}
              />
              <div className={styles.cropActions}>
                <button className={styles.sureButton} style={{ marginRight: "5px" }} type="button" onClick={showCroppedImage}>
                  Save
                </button>
                <button className={styles.sureButton} type="button" onClick={handleCancelCrop}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          <button type="submit">{existingTestimonial ? "Update" : "Add"} Testimonial</button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;
