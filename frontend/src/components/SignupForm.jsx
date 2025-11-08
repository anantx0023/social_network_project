import { useState, useRef } from 'react';
import axios from '../api/axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    re_password: '',
    date_of_birth: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profile_picture: 'Image size should not exceed 5MB' });
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors({ ...errors, profile_picture: 'Only JPEG, JPG, and PNG files are allowed' });
        return;
      }
      
      setProfilePicture(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setErrors({ ...errors, profile_picture: '' });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Create FormData to send files
      const data = new FormData();
      data.append('email', formData.email);
      data.append('full_name', formData.full_name);
      data.append('password', formData.password);
      data.append('re_password', formData.re_password);
      if (formData.date_of_birth) {
        data.append('date_of_birth', formData.date_of_birth);
      }
      
      // Only append profile picture if one was selected
      if (profilePicture) {
        data.append('profile_picture', profilePicture);
      }

      const response = await axios.post('/signup/', data);
      
      // Save tokens
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      
      setSuccess('Signup successful! Redirecting...');
      console.log('User:', response.data.user);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
      
    } catch (err) {
      if (err.response?.data) {
        // Handle field-specific errors from backend
        const backendErrors = err.response.data;
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Signup failed. Please try again.' });
      }
      console.error('Signup error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleUploadClick}
            className="mt-3 text-blue-500 border border-blue-500 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
          >
            Upload Profile Pic
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="hidden"
          />
          {errors.profile_picture && (
            <p className="mt-1 text-xs text-red-500">{errors.profile_picture}</p>
          )}
        </div>

        {/* Error/Success Messages */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errors.general}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              placeholder="dd/mm/yyyy"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password and Re-Password in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="re_password" className="block text-sm font-medium text-gray-700 mb-1">
                Re - Password
              </label>
              <input
                id="re_password"
                name="re_password"
                type="password"
                value={formData.re_password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.re_password && (
                <p className="mt-1 text-xs text-red-500">{errors.re_password}</p>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <p className="text-xs text-gray-500">
            Use A-Z, a-z, 0-9, !@#$%^&* in password
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
