import React, { useState, useEffect } from 'react';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import { Avatar, Button, TextField, Grid, CircularProgress } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from 'axios';

const AdminProfile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState(null); // Ensure this is null initially
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.put('/api/admin/profile', updatedData);
      if (response.data.success) {
        setAdminData(response.data.profile); // Assuming the response includes updated profile data
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/admin/profile');
        if (response.data.success) {
          setAdminData(response.data.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onNavigate={handleNavigation} />

      <div className={`flex-1 bg-gray-100 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />

        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Profile</h1>

          <div className="bg-white rounded-lg shadow p-6">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={3} className="flex justify-center">
                <Avatar
                  alt="Admin Profile Picture"
                  src={adminData?.profilePicture || "/path/to/default-profile.jpg"}
                  sx={{ width: 120, height: 120 }}
                />
              </Grid>

              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      name="name"
                      value={isEditing ? updatedData.name || adminData?.name : adminData?.name || ''}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      name="email"
                      value={isEditing ? updatedData.email || adminData?.email : adminData?.email || ''}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      fullWidth
                      name="phone"
                      value={isEditing ? updatedData.phone || adminData?.phone : adminData?.phone || ''}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Role"
                      fullWidth
                      value="Administrator"
                      variant="outlined"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="About"
                      fullWidth
                      name="about"
                      value={isEditing ? updatedData.about || adminData?.about : adminData?.about || ''}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                <div className="mt-6 flex justify-end">
                  {isEditing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
