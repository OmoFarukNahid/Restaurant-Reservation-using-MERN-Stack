import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authState';
import Navbar from './Navbar';

const Recommendations = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:4000/api/v1/recommendations',
        { withCredentials: true }
      );
      setRecommendations(data.recommendations);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to make a recommendation');
      navigate('/login');
      return;
    }

    if (!title || !description) {
      toast.error('Title and description are required');
      return;
    }

    setIsLoading(true);
    
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:4000/api/v1/recommendations/${editingId}`,
          { title, description, image },
          { withCredentials: true }
        );
        toast.success('Recommendation updated successfully');
      } else {
        await axios.post(
          'http://localhost:4000/api/v1/recommendations',
          { title, description, image },
          { withCredentials: true }
        );
        toast.success('Recommendation added successfully');
      }
      
      setTitle('');
      setDescription('');
      setImage('');
      setEditingId(null);
      fetchRecommendations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (recommendation) => {
    setTitle(recommendation.title);
    setDescription(recommendation.description);
    setImage(recommendation.image);
    setEditingId(recommendation._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      try {
        await axios.delete(
          `http://localhost:4000/api/v1/recommendations/${id}`,
          { withCredentials: true }
        );
        toast.success('Recommendation deleted successfully');
        fetchRecommendations();
      } catch (error) {
        toast.error('Failed to delete recommendation');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h1>Dish Recommendations</h1>
          <p>Share your favorite dishes with our community</p>
        </div>
        
        {!user && (
          <div className="auth-required">
            <h3>Join our foodie community!</h3>
            <p>Login to share your recommendations and see what others are enjoying</p>
            <button 
              className="auth-button"
              onClick={() => navigate('/login')}
            >
              Login / Register
            </button>
          </div>
        )}

        {user && (
          <div className="recommendations-content">
            <form onSubmit={handleSubmit} className="recommendation-form">
              <h2>{editingId ? 'Edit Your Recommendation' : 'Share a New Dish'}</h2>
              
              <div className="form-group">
                <label htmlFor="title">Dish Title*</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Spicy Chicken Tacos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  placeholder="Tell us why you love this dish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Image URL (optional)</label>
                <input
                  id="image"
                  type="text"
                  placeholder="Paste image link here"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : editingId ? (
                    'Update Recommendation'
                  ) : (
                    'Share Your Recommendation'
                  )}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setImage('');
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="recommendations-grid">
              <h2 className="your-recommendations">Your Recommendations</h2>
              
              {recommendations.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't shared any recommendations yet</p>
                  <p>Start by filling out the form above!</p>
                </div>
              ) : (
                <div className="cards-container">
                  {recommendations.map((rec) => (
                    <div className="recommendation-card" key={rec._id}>
                      {rec.image && (
                        <div className="card-image">
                          <img src={rec.image} alt={rec.title} />
                        </div>
                      )}
                      <div className="card-content">
                        <h3>{rec.title}</h3>
                        <p className="card-description">{rec.description}</p>
                        <div className="card-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(rec)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(rec._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Recommendations;