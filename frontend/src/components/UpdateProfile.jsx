import { useState, useEffect } from 'react';
import axios from '../api/axios';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentProfileUrl, setCurrentProfileUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch current profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/profile/');
        setFormData({
          full_name: response.data.full_name || '',
          date_of_birth: response.data.date_of_birth || '',
        });
        if (response.data.profile_picture) {
          setCurrentProfileUrl(`http://127.0.0.1:8000${response.data.profile_picture}`);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData to send files
      const data = new FormData();
      data.append('full_name', formData.full_name);
      if (formData.date_of_birth) {
        data.append('date_of_birth', formData.date_of_birth);
      }
      
      // Only append profile picture if a new one was selected
      if (profilePicture) {
        data.append('profile_picture', profilePicture);
      }

      const response = await axios.patch('/profile/', data);
      
      setSuccess('Profile updated successfully!');
      
      // Update current profile picture if changed
      if (response.data.user.profile_picture) {
        setCurrentProfileUrl(`http://127.0.0.1:8000${response.data.user.profile_picture}`);
        setPreviewUrl(null);
        setProfilePicture(null);
      }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed. Please try again.');
      console.error('Update error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          
          {/* Current profile picture */}
          {currentProfileUrl && !previewUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-1">Current picture:</p>
              <img
                src={currentProfileUrl}
                alt="Current profile"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}
          
          {/* Preview of new picture */}
          {previewUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-1">New picture preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}
          
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
