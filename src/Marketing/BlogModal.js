import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog, updateBlog, fetchBlogs } from '../store/actions/blogActions';
import styles from '../Styles/BlogModal.module.css';
import { toast } from 'react-toastify';

const BlogModal = ({ isOpen, onRequestClose, blog }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(blog ? blog.title : '');
  const [details, setDetails] = useState(blog ? blog.details : '');
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const blogAddUpdate = useSelector((state) => state.blogAddUpdate);
  const { loading, success, error } = blogAddUpdate;

  // Handle file change event
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image; // Use the image state

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    img.onload = () => {
      ctx.drawImage(
        img,
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
        const webpFile = new File([blob], 'cropped_image.webp', { type: 'image/webp' });
        setCroppedImage(webpFile);
      }, 'image/webp', 0.8);
    };
  }, [image]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = new FormData();
    blogData.append('title', title);
    blogData.append('details', details);
    if (croppedImage) blogData.append('image', croppedImage); // Append the cropped WebP image file

    if (blog) {
      dispatch(updateBlog(blog.id, blogData));
    } else {
      dispatch(addBlog(blogData));
    }
  };

  React.useEffect(() => {
    if (success) {
      toast.success('Blog successfully saved!');
      dispatch(fetchBlogs());
      onRequestClose(); // Close the modal
    }
    if (error) {
      toast.error('Error saving blog');
    }
  }, [success, error]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className={styles.modal}
        ariaHideApp={false}
      >
        <h2>{blog ? 'Edit Blog' : 'Add Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <label>Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
          
          <label>Image:</label>
          <input style={{ display: 'block' }} type="file" onChange={handleFileChange} />
          {cropModalOpen && (
            <div className={styles.cropperModal}>
              <div className={styles.cropperContainer}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  minZoom={1} // Allow zooming out
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <button onClick={() => setCropModalOpen(false)}>Crop</button>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default BlogModal;
