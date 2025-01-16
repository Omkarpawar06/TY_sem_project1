// src/AdminList.js
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import '../assets/Styles/AdminList.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch admins when component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Admin/getAdmins');
      if (response.data.admins) {
        setAdmins(response.data.admins);
      } else {
        toast.error('No admins found.');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Error fetching admins.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="adminlist-container"><p>Loading admins...</p></div>;
  }

  return (
    <div className='adminlist-container'>
      <div className="admin-list">
        <h2>Admin List</h2>
        {admins.length === 0 ? (
          <p>No admins available.</p>
        ) : (
          <ul>
            {admins.map((admin) => (
              <li key={admin._id} className="admin-item">
                <span className="admin-name">{admin.name}</span> - <span className="admin-email">{admin.email}</span>
              </li>
            ))}
          </ul>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminList;
