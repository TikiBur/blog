import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ReactMarkdown from 'react-markdown';
import Loader from '../components/Loader';
import LikeButton from '../components/LikeButton';
import '../styles/global.css';
import ConfirmationModal from './ConfirmationModal';

const API_URL = 'https://blog-platform.kata.academy/api';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const headers = {};
        if (user?.token) {
          headers['Authorization'] = `Token ${user.token}`;
        }
        
        const res = await fetch(`${API_URL}/articles/${slug}`, { headers });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to load article');
        
        setArticle(data.article);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить статью.');
      } finally {
        setLoading(false);
      }
    };
  
    loadArticle();
  }, [slug, user?.token]);

  const deleteArticle = async () => {
    try {
      const res = await fetch(`${API_URL}/articles/${slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${user.token}` }
      });

      if (!res.ok) throw new Error('Ошибка при удалении статьи');
      navigate('/');
    } catch (err) {
      alert('Ошибка удаления статьи');
    }
  };

  const handleLikeToggle = (newState) => {
    setArticle((prevArticle) => ({
      ...prevArticle,
      favorited: newState,
      favoritesCount: newState ? prevArticle.favoritesCount + 1 : prevArticle.favoritesCount - 1
    }));
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Статья не найдена</p>;

  return (
    <div className="article-page-container">
      <div className="article-page">
        <div className="article-header">
          <div className="article-title-wrapper">
            <h1 className="article-title">{article.title}</h1>
            <LikeButton 
              slug={slug} 
              favorited={article.favorited} 
              favoritesCount={article.favoritesCount} 
              onLikeToggle={handleLikeToggle}
            />
          </div>
          
          <div className="article-meta">
            <div className="article-meta-content">
              <span className="article-author">{article.author.username}</span>
              <span className="article-date">
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <img 
              className="article-avatar"
              src={article.author.image || '../assets/images/man.png'} 
              alt="Author" 
            />
          </div>
        </div>

        {article.tagList && article.tagList.length > 0 && (
          <div className="article-tags">
            {article.tagList.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="desc">
          {article.description && (
            <div className="article-description">
              {article.description}
            </div>
          )}

          {user?.username === article.author.username && (
            <div className="article-actions">
              <button 
                id="delete-button"
                className="delete-btn"
                onClick={() => setShowModal(true)}
              >
                Delete
              </button>
              <button 
                className="edit-btn"
                onClick={() => navigate(`/edit/${slug}`)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="article-body">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </div>

      {showModal && (
        <ConfirmationModal
          onConfirm={deleteArticle}
          onCancel={() => setShowModal(false)}
          triggerElementId="delete-button"
        />
      )}
    </div>
  );
};

export default ArticlePage;