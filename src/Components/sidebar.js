import React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaSignOutAlt,
  FaBlog,
  FaCog,
  FaEnvelope,
  FaEye,
  FaUser,
  FaTachometerAlt,
} from "react-icons/fa";
import { SiPolygon } from "react-icons/si";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../Styles/sidebar.module.css";
import { toggleSidebar } from "../store/actions/sidebarActions"; // Import action
import { logout } from "../store/actions/authActions";


const Sidebar = ({
  collapsed,
  toggleSidebar,
  logout,
  admins,
  id,
  permissions,
}) => {
  const location = useLocation();
  const { pathname } = location;

  // Admin permissions object
  const admin = {
    user: permissions[0].user,
    matching: permissions[0].matching,
    homepage_image: permissions[0].homepage_image,
    social_links: permissions[0].social_link,
    testimonial: permissions[0].testimonial,
    sms: permissions[0].sms,
    blog: permissions[0].blog,
    report: permissions[0].report,
    admin: permissions[0].admin_permission,
    SuccessList: permissions[0].success_list,
  };

  const handleLogout = () => {
    logout();
  };
  //console.log(admin, id, permissions);
  return (
    <div
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      style={{
        width: collapsed ? "80px" : "250px",
        zIndex: "9999",
        height: "-webkit-fill-available",
      }}
    >
      <div className={styles.sidebarHeader}>
        <button
          className="btn btn-link"
          onClick={toggleSidebar}
          style={{ marginLeft: collapsed ? "12px" : "10px" , color: "black"}}
        >
          <FaBars />
        </button>
      </div>
      <ul className="nav nav-pills flex-column mb-auto">
        {
          <li className="nav-item">
            <Link
              to="/dashboard"
              className={`nav-link ${
                pathname === "/dashboard" ? "active" : ""
              }`}
              style={style1.kala}
            >
              <FaTachometerAlt className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Dashboard</span>}
            </Link>
          </li>
        }
        {admin.user === 1 && (
          <li className="nav-item">
            <Link
              to="/user"
              className={`nav-link ${pathname === "/user" ? "active" : ""}`}
              style={style1.kala}
            >
              <FaUser className="menu-icon" />
              <div className={styles.menu_text_arrow_container}>
                  {!collapsed && <span className={styles.navText}>Users</span>}
                  <img src={`${process.env.PUBLIC_URL}/right_arrow.svg`} className={styles.arrow} alt=">"></img>
              </div>
            </Link>
          </li>
        )}
        {admin.matching === 1 && (
          <li className="nav-item">
            <Link
              to="/matching"
              className={`nav-link ${pathname === "/matching" ? "active" : ""}`}
              style={style1.kala}
            >
              <SiPolygon className="menu-icon" />
              <div className={styles.menu_text_arrow_container}>
                  {!collapsed && <span className={styles.navText}>Matching</span>}
                  <img src={`${process.env.PUBLIC_URL}/right_arrow.svg`} className={styles.arrow} alt=">"></img>
              </div>
            </Link>
          </li>
        )}
        {admin.homepage_image === 1 ||
        admin.social_links === 1 ||
        admin.testimonial === 1 ||
        admin.SuccessList === 1 ? (
          <br />
        ) : (
          ""
        )}

        {!collapsed &&
        (admin.homepage_image === 1 ||
          admin.social_links === 1 ||
          admin.testimonial === 1 ||
          admin.SuccessList === 1) ? (
          <div>
            <h3>SETTINGS</h3>
          </div>
        ) : (
          ""
        )}

        {admin.homepage_image === 1 ||
        admin.social_links === 1 ||
        admin.testimonial === 1 ||
        admin.SuccessList === 1 ? (
          <hr />
        ) : (
          ""
        )}
        {admin.homepage_image === 1 && (
          <li className="nav-item">
            <Link
              to="/home-page-image"
              className={`nav-link ${
                pathname === "/home-page-image" ? "active" : ""
              }`}
              style={style1.kala}
            >
              <FaHome className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Homepage Image</span>}
            </Link>
          </li>
        )}
        {admin.social_links === 1 && (
          <li className="nav-item">
            <Link
              to="/social-link-update"
              className={`nav-link ${
                pathname === "/social-link-update" ? "active" : ""
              }`}
              style={style1.kala}
            >
              <FaCog className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Social Links</span>}
            </Link>
          </li>
        )}
        {admin.testimonial === 1 && (
          <li className="nav-item">
            <Link
              to="/testimonial"
              className={`nav-link ${
                pathname === "/testimonial" ? "active" : ""
              }`}
              style={style1.kala}
            >
              <FaCog className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Testimonial</span>}
            </Link>
          </li>
        )}
        {admin.SuccessList === 1 && (
          <li className="nav-item">
            <Link
              to="/success-list"
              className={`nav-link ${
                pathname === "/success-list" ? "active" : ""
              }`}
              style={style1.kala}
            >
              <FaCog className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Success List</span>}
            </Link>
          </li>
        )}
        {!collapsed && admin.sms === 1 ? <br /> : ""}
        {!collapsed && admin.sms === 1 ? (
          <div>
            <h3>MARKETING</h3>
          </div>
        ) : (
          ""
        )}

        {!collapsed && admin.sms === 1 ? <hr /> : ""}
        {admin.sms === 1 && (
          <li className="nav-item">
            <Link
              to="/sms"
              className={`nav-link ${pathname === "/sms" ? "active" : ""}`}
              style={style1.kala}
            >
              <FaEnvelope className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Sms</span>}
            </Link>
          </li>
        )}

        {admin.blog === 1 && (
          <li className="nav-item">
            <Link
              to="/blog"
              className={`nav-link ${pathname === "/blog" ? "active" : ""}`}
              style={style1.kala}
            >
              <FaBlog className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Blogs</span>}
            </Link>
          </li>
        )}
        {!collapsed && (admin.report === 1 || admin.admin === 1) ? <br /> : ""}
        {!collapsed && (admin.report === 1 || admin.admin === 1) ? (
          <div>
            <h3>ENVIRONMENT</h3>
          </div>
        ) : (
          ""
        )}

        {!collapsed && (admin.report === 1 || admin.admin === 1) ? <hr /> : ""}
        {admin.report === 1 && (
          <li className="nav-item">
            <Link
              to="/report"
              className={`nav-link ${pathname === "/report" ? "active" : ""}`}
              style={style1.kala}
            >
              <FaEye className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Report</span>}
            </Link>
          </li>
        )}
        {admin.admin === 1 && (
          <li className="nav-item">
            <Link
              to="/admin"
              className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
              style={style1.kala}
            >
              <FaEye className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Admin</span>}
            </Link>
          </li>
        )}
        {admin.admin === 1 && (
          <li className="nav-item">
            <Link
              to="/support_chat"
              className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
              style={style1.kala}
            >
              <FaEye className="menu-icon" />
              {!collapsed && <span className={styles.navText}>Support Chat</span>}
            </Link>
          </li>
        )}
        <br />
        {!collapsed ? (
          <div>
            <h3>SIGN OUT</h3>
          </div>
        ) : (
          ""
        )}
        <li
          className="nav-item"
          style={{ textAlign: "left", marginLeft: "20px", cursor: "pointer" }}
          onClick={handleLogout}
        >
          <FaSignOutAlt className="menu-icon" />
          {!collapsed && <span className={styles.navText}>Logout</span>}
        </li>
        <br />
        <br />
        <br />
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  admins: state.admin.admins,
  id: state.auth.id,
  permissions: state.auth.permissions,
});

const mapDispatchToProps = {
  toggleSidebar,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

const style1 = {
  kala: {
    color: "black",
    display: "flex",
  },
};
