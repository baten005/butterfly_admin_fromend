import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../store/actions/blogActions';
import BlogModal from './BlogModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";
import styles from "../Styles/blog.module.css";
import Sidebar from '../Components/sidebar';
function Blog({ collapsed }) {

  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const blogList = useSelector((state) => state.blogList);
  const { loading, blogs, error } = blogList;

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleAddBlog = () => {
    setSelectedBlog(null);
    setModalOpen(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.blogContainer}>
      <button className={styles.addButton} onClick={handleAddBlog}>
        Add Blog
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className={styles.blogList}>
          {blogs.map((blog) => (
            <div key={blog.id} className={styles.blogCard}>
              <img src={blog.image} alt={blog.title} className={styles.blogImage} />
              <h3 className={styles.title}>{blog.title}</h3>
              <p className={styles.details}>{blog.details}</p>
              <button onClick={() => handleEditBlog(blog)} className={styles.editButton}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      <BlogModal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        blog={selectedBlog}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
});

export default connect(mapStateToProps)(Blog);
