
import React, { useEffect } from 'react';
import Sidebar from '../Components/sidebar';
import { FaUser } from 'react-icons/fa';
import styles from '../Styles/admin.module.css';
import { connect } from 'react-redux';
import {
  fetchAdmins,
  createAdmin,
  updateAdminPermissions,
  deleteAdmin,
  setSelectedAdmin,
  setSelectedPermissions,
} from '../store/actions/adminActions';

const Admin = ({
  collapsed,
  admins,
  selectedAdmin,
  selectedPermissions,
  loading,
  message,
  fetchAdmins,
  createAdmin,
  updateAdminPermissions,
  deleteAdmin,
  setSelectedAdmin,
  setSelectedPermissions,
}) => {
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const permissionsList = [
    'dashboard',
    'user',
    'matching',
    'homepage_image',
    'social_link',
    'testimonial',
    'success_list',
    'sms',
    'blog',
    'report',
    'admin_permission',
  ];

  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
    const permissions = permissionsList.filter(
      (permission) => admin[permission.toLowerCase()]
    );
    setSelectedPermissions(permissions);
  };

  const handlePermissionClick = (permission) => {
    const newSelectedPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter((item) => item !== permission)
      : [...selectedPermissions, permission];

    setSelectedPermissions(newSelectedPermissions);
  };

  const handleSend = () => {
    if (selectedAdmin && selectedAdmin.username && selectedAdmin.password) {
      createAdmin(selectedAdmin.username, selectedAdmin.password);
    }
  };

  const handleUpdate = () => {
    if (selectedAdmin && selectedAdmin.id) {
      updateAdminPermissions(selectedPermissions, selectedAdmin.id);
    }
  };

  const handleDelete = () => {
    if (selectedAdmin && selectedAdmin.id && window.confirm(`Do you really want to delete ${selectedAdmin.username} from admin?`)) {
      deleteAdmin(selectedAdmin.id);
    }
  };

  return (
    <>
      <Sidebar />
      <div className={`${styles.content} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.permissionFormContainer}>
          <div className={styles.permissionLeftDiv}>
                          <label>Create Account</label>
            <div className={styles.permissionAccount}>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setSelectedAdmin({ ...selectedAdmin, username: e.target.value })}
              />
              <input
                type="text"
                placeholder="Password"
                onChange={(e) => setSelectedAdmin({ ...selectedAdmin, password: e.target.value })}
              />
              <div>
                <button onClick={handleSend} className={styles.createButton}>
                  Create
                </button>
              </div>
            </div>
            {selectedAdmin && (
              <div className={styles.permissions}>
                <div className={styles.permissionsTypeContainer}>
                  <p>Permission for {selectedAdmin.username}</p>
                  <div className={styles.permissionsCategory}>
                    {permissionsList.map((permission) => (
                      <p
                        style={{fontSize:"15px"}}
                        key={permission}
                        className={
                          selectedPermissions.includes(permission)
                            ? styles.selected
                            : ''
                        }
                        onClick={() => handlePermissionClick(permission)}
                      >
                        {permission}
                      </p>
                    ))}
                  </div>
                </div>
                <div className={styles.updBtnContainer}>
                  <div>
                    <button onClick={handleUpdate} className={styles.updateButton}>
                      {loading ? 'loading...' : 'Update'}
                    </button>
                  </div>
                  <div>
                    <button onClick={handleDelete} className={styles.updateButton}>
                      {loading ? 'loading...' : 'Delete Admin'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {message && <p className={styles.notificationMessage}>{message}</p>}
          </div>
          <div className={styles.permRight}>
            <p>Users</p>
            <div className={styles.permissionRightDiv}>
              <div className={styles.adminList}>
                {admins.map((admin) => (
                  <p
                    key={admin.id}
                    className={`${styles.pCard} ${
                      (selectedAdmin && selectedAdmin.id == admin.id)
                        ? styles.selectedAdmin
                        : ''
                    }`}
                    onClick={() => handleAdminClick(admin)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={styles.cardName} style={{ fontSize: '20px', marginRight: '5px' }}>
                      {admin.username}
                    </span>
                    <FaUser size={14} className={styles.cardIcon} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.sidebar.collapsed,
  admins: state.admin.admins,
  selectedAdmin: state.admin.selectedAdmin,
  selectedPermissions: state.admin.selectedPermissions,
  loading: state.admin.loading,
  message: state.admin.message,
});

const mapDispatchToProps = {
  fetchAdmins,
  createAdmin,
  updateAdminPermissions,
  deleteAdmin,
  setSelectedAdmin,
  setSelectedPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
