# Social Network App

A full-stack social networking application built with Django REST Framework and React.

## 🚀 Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Profile Management**: Upload and manage profile pictures
- **Post Creation**: Create posts with images
- **Social Interactions**: Like and dislike posts
- **Real-time Feed**: View posts from all users
- **Protected Routes**: Secure page access with authentication

## 🛠️ Tech Stack

### Backend
- **Django 5.2.7**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database (psycopg2-binary)
- **JWT Authentication**: djangorestframework-simplejwt
- **CORS Headers**: Cross-origin resource sharing
- **Pillow**: Image processing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (or use SQLite for development)

## 🔧 Installation & Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social_network_project
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database** (optional)
   - Update `social_network/settings.py` with your database credentials
   - Or use SQLite by keeping default settings

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser** (optional)
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the backend server**
   ```bash
   python manage.py runserver
   ```
   Backend will run on: `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

## 🎯 Usage

1. Open your browser and go to `http://localhost:5173`
2. **New User**: Click "Create Account" to signup
3. **Existing User**: Login with your credentials
4. **Home Page**: Create posts, view feed, like/dislike posts
5. **Logout**: Click the logout button in the header

## 📁 Project Structure

```
social_network_project/
├── backend/
│   ├── social_network/       # Main Django project
│   ├── users/                # User app (authentication, profiles)
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/              # API configuration
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── media/                    # User uploaded files
    ├── profile_pictures/
    └── post_images/
```

## 🔐 API Endpoints

- `POST /api/signup/` - User registration
- `POST /api/login/` - User login
- `GET /api/posts/` - Get all posts
- `POST /api/posts/` - Create new post
- `POST /api/posts/:id/like/` - Like a post
- `POST /api/posts/:id/dislike/` - Dislike a post

## 🌟 Future Enhancements

- [ ] User profile pages
- [ ] Comments on posts
- [ ] Follow/Unfollow users
- [ ] Direct messaging
- [ ] Post editing and deletion
- [ ] Search functionality
- [ ] Notifications

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Anant**
- GitHub: [@anantx0023](https://github.com/anantx0023)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐️ Show your support

Give a ⭐️ if this project helped you!
