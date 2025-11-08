# Image Upload Implementation Guide

## ✅ Your Backend is Ready!

Your Django backend already supports image uploads for:
- **Profile Pictures** (during signup and profile update)
- **Post Images** (when creating posts)

## 🔧 Frontend Changes Made

### 1. Updated `axios.js`
- Removed hardcoded `Content-Type: application/json`
- Now automatically detects `FormData` for file uploads
- Sets `multipart/form-data` automatically when uploading files

### 2. Created Example Components

#### **SignupForm.jsx** - User registration with profile picture
```jsx
import SignupForm from './components/SignupForm';
```

#### **CreatePost.jsx** - Create posts with images
```jsx
import CreatePost from './components/CreatePost';
```

#### **UpdateProfile.jsx** - Update profile with new profile picture
```jsx
import UpdateProfile from './components/UpdateProfile';
```

#### **PostList.jsx** - Display posts with images and like/dislike
```jsx
import PostList from './components/PostList';
```

## 📝 How to Use FormData for Image Uploads

### Example 1: Signup with Profile Picture
```javascript
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('full_name', 'John Doe');
formData.append('password', 'SecurePass123!');
formData.append('re_password', 'SecurePass123!');
formData.append('profile_picture', fileObject); // File from input

await axios.post('/signup/', formData);
```

### Example 2: Create Post with Image
```javascript
const formData = new FormData();
formData.append('description', 'Check out this photo!');
formData.append('image', fileObject); // File from input

await axios.post('/posts/', formData);
```

### Example 3: Update Profile Picture
```javascript
const formData = new FormData();
formData.append('profile_picture', fileObject); // File from input

await axios.patch('/profile/', formData);
```

## 🎨 Frontend Image Handling Tips

### 1. File Input
```jsx
<input
  type="file"
  accept="image/jpeg,image/jpg,image/png"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  }}
/>
```

### 2. Image Preview
```jsx
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }
};

// Display preview
{previewUrl && <img src={previewUrl} alt="Preview" />}
```

### 3. Display Uploaded Images
```jsx
// For images stored on backend
<img src={`http://127.0.0.1:8000${post.image}`} alt="Post" />
<img src={`http://127.0.0.1:8000${user.profile_picture}`} alt="Profile" />
```

## 🔒 Backend Validation (Already Implemented)

### Profile Pictures
- **Max size**: 5MB
- **Allowed formats**: JPEG, JPG, PNG
- **Upload location**: `media/profile_pictures/`

### Post Images
- **Max size**: 10MB
- **Allowed formats**: JPEG, JPG, PNG
- **Upload location**: `media/post_images/`

## 🚀 Testing Your Implementation

### 1. Start Backend
```bash
cd social_network_project
python manage.py runserver
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Image Upload
1. Go to signup page
2. Fill in user details
3. Select an image for profile picture
4. Submit form
5. Check `media/profile_pictures/` folder for uploaded image

## 🐛 Troubleshooting

### Issue: Images not uploading
**Solution**: Make sure you're using `FormData` instead of JSON:
```javascript
// ❌ Wrong - Won't work for files
await axios.post('/signup/', { email, password, profile_picture });

// ✅ Correct - Use FormData for files
const formData = new FormData();
formData.append('email', email);
formData.append('profile_picture', fileObject);
await axios.post('/signup/', formData);
```

### Issue: 413 Request Entity Too Large
**Solution**: Image file is too large. Compress it or check backend limits.

### Issue: Images not displaying
**Solution**: Make sure to prefix with full URL:
```javascript
// ✅ Correct
<img src={`http://127.0.0.1:8000${post.image}`} />

// ❌ Wrong
<img src={post.image} />
```

## 📦 Required Packages (Already Installed)

### Backend
- Pillow (for image processing)

### Frontend
- axios (for HTTP requests)

## 🎯 Summary

**YES**, your implementation **CAN handle images**! ✅

- ✅ Backend models support images
- ✅ Backend validation is implemented
- ✅ Media files are configured
- ✅ Frontend axios now supports FormData
- ✅ Example components provided
- ✅ Ready to use!

Just use the example components I created or follow the FormData pattern shown above!
