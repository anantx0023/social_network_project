# Social Network App - Setup Complete! 🎉

## ✅ What's Been Implemented

### Pages Created:
1. **Login Page** (`/login`) - Default landing page
2. **Signup Page** (`/signup`) - User registration with profile picture
3. **Home Page** (`/home`) - Protected page showing posts feed

### Features:
- ✅ Full authentication flow (Login/Signup)
- ✅ Navigation between Login and Signup pages
- ✅ Profile picture upload during signup
- ✅ Create posts with images
- ✅ View all posts with like/dislike
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Logout functionality
- ✅ Token-based authentication (JWT)

## 🚀 How to Run

### 1. Start Backend (Django)
```bash
# In the project root directory
python manage.py runserver
```
Backend will run on: `http://127.0.0.1:8000`

### 2. Start Frontend (React + Vite)
```bash
# In the frontend directory
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

## 📱 User Flow

### For New Users:
1. Open `http://localhost:5173` → Redirects to **Login Page**
2. Click "Create Account" → Go to **Signup Page**
3. Fill in details and upload profile picture (optional)
4. Click "Sign Up" → Automatically logs in and redirects to **Home Page**

### For Existing Users:
1. Open `http://localhost:5173` → **Login Page**
2. Enter email and password
3. Click "Login" → Redirects to **Home Page**

### On Home Page:
- See your profile picture and name in header
- Create new posts with/without images
- View all posts from all users
- Like/Dislike posts
- Logout button in header

## 🔐 Authentication Flow

- Login/Signup saves JWT tokens to `localStorage`
- All API requests automatically include the token
- Home page is protected - redirects to login if not authenticated
- Logout clears tokens and redirects to login

## 🎨 Design

- Clean, modern UI matching your provided designs
- Responsive layout
- Tailwind CSS for styling
- Smooth transitions and hover effects

## 📂 File Structure

```
frontend/src/
├── api/
│   └── axios.js              # API configuration
├── components/
│   ├── CreatePost.jsx        # Create post component
│   └── PostList.jsx          # Display posts component
├── pages/
│   ├── LoginPage.jsx         # Login page
│   ├── SignupPage.jsx        # Signup page
│   └── HomePage.jsx          # Home/Feed page
├── App.jsx                   # Main app with routing
└── main.jsx                  # Entry point
```

## 🔗 API Endpoints Used

- `POST /api/signup/` - User registration
- `POST /api/login/` - User login
- `GET /api/posts/` - Get all posts
- `POST /api/posts/` - Create new post
- `POST /api/posts/:id/like/` - Like a post
- `POST /api/posts/:id/dislike/` - Dislike a post

## 🎯 Next Steps (Optional Enhancements)

- Add password reset functionality
- Add user profile page
- Add edit/delete post functionality
- Add comments on posts
- Add real-time notifications
- Add search users functionality
- Add follow/unfollow users

## ⚠️ Important Notes

1. Make sure PostgreSQL database is running
2. Make sure Django backend is running on port 8000
3. CORS is configured for `http://localhost:5173`
4. Images are stored in `media/` folder in backend

## 🐛 Troubleshooting

### If frontend doesn't start:
- Check Node.js version (should be compatible with Vite)
- Try: `npm install` in frontend directory

### If login/signup doesn't work:
- Check if backend is running
- Check browser console for errors
- Verify CORS settings in Django

### If images don't display:
- Check if media files are being served by Django
- Verify `MEDIA_URL` and `MEDIA_ROOT` in settings.py

---

**Your social network app is ready to use!** 🚀
