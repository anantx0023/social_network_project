import { useState, useEffect } from 'react';
import axios from '../api/axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts/');
      console.log('Posts data:', response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load posts');
      setLoading(false);
      console.error('Error fetching posts:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like/`);
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/dislike/`);
      fetchPosts();
    } catch (err) {
      console.error('Error disliking post:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <p className="text-gray-500">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {post.user.profile_picture ? (
                  <img
                    src={post.user.profile_picture.startsWith('http') ? post.user.profile_picture : `http://127.0.0.1:8000${post.user.profile_picture}`}
                    alt={post.user.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {post.user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">{post.user.full_name}</h3>
                  <p className="text-xs text-gray-500">
                    Posted on - {formatDate(post.created_at)}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-3">
              <p className="text-gray-800 font-bold leading-relaxed text-left">{post.description}</p>
            </div>

            {post.image && (
              <div className="w-full bg-gray-50 flex items-center justify-center" style={{ maxHeight: '600px' }}>
                <img
                  src={post.image.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`}
                  alt="Post"
                  className="w-full max-h-[600px] object-contain"
                  onError={(e) => {
                    console.error('Failed to load image:', post.image);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', post.image)}
                />
              </div>
            )}

            <div className="p-4 border-t border-gray-100 flex items-center space-x-3">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                  post.user_reaction === 'like'
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-50'
                }`}
              >
                <svg className="w-5 h-5" fill={post.user_reaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Like {post.likes_count}</span>
              </button>

              <button
                onClick={() => handleDislike(post.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                  post.user_reaction === 'dislike'
                    ? 'bg-red-500 text-white'
                    : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <svg className="w-5 h-5" fill={post.user_reaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                <span>Dislike {post.dislikes_count}</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
