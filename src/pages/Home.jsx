import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin, Pagination, Alert } from 'antd';
import '../styles/global.css';
import LikeButton from '../components/LikeButton';

const ARTICLES_PER_PAGE = 5;
const API_URL = 'https://blog-platform.kata.academy/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Инициализируем currentPage из localStorage или ставим 1
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(localStorage.getItem('currentPage')) || 1;
  });

  const [likedArticles, setLikedArticles] = useState(() => {
    const saved = localStorage.getItem('likedArticles');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
  }, [likedArticles]);

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * ARTICLES_PER_PAGE;
      const res = await fetch(`${API_URL}/articles?limit=${ARTICLES_PER_PAGE}&offset=${offset}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
      
      if (!data.articles) {
        throw new Error('Invalid data format from API');
      }

      const updatedArticles = data.articles.map(article => ({
        ...article,
        favorited: likedArticles[article.slug] || article.favorited
      }));
  
      setArticles(updatedArticles || []);
      setTotalArticles(data.articlesCount || 0);
    } catch (err) {
      console.error('Fetch articles error:', err);
      setError(err.message || 'Failed to load articles');
      setArticles([]);
      setTotalArticles(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  // ✅ Сохраняем текущую страницу при её изменении
  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  const handleLikeToggle = (slug, newState) => {
    setLikedArticles(prev => ({
      ...prev,
      [slug]: newState
    }));

    setArticles(prevArticles => 
      prevArticles.map(article => 
        article?.slug === slug 
          ? { 
              ...article, 
              favorited: newState, 
              favoritesCount: newState ? (article.favoritesCount || 0) + 1 : Math.max((article.favoritesCount || 0) - 1, 0) 
            } 
          : article
      )
    );
  };

  if (error) {
    return (
      <div className="articles-container">
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          style={{ margin: '20px 0' }}
        />
        <button onClick={() => fetchArticles(currentPage)}>Retry</button>
      </div>
    );
  }

  return (
    <div className="articles-container">
      {loading && <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />}

      {!loading && articles.length === 0 && (
        <Alert message="No articles found" type="info" showIcon />
      )}

      {!loading && articles.length > 0 && (
        <>
          {articles.map((article) => (
  <div key={article.slug} className="article-item" style={{ marginBottom: 20 }}>
    <div className="like">
      <Link to={`/articles/${article.slug}`} className="article-title">
        <h3 style={{ margin: '0' }}>{article.title || 'Untitled'}</h3>
      </Link>
      <LikeButton
        style={{ display: 'flex', alignItems: 'center' }}
        slug={article.slug}
        favorited={!!article.favorited}
        favoritesCount={article.favoritesCount || 0}
        onLikeToggle={(newState) => handleLikeToggle(article.slug, newState)}
      />
    </div>

    <p>{article.description || 'No description'}</p>

        <div className="article-meta" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: 'auto',
          marginTop: '1rem',
          order: 2
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontSize: '1.5rem',
            lineHeight: '1.2',
            color: '#000000D9'
          }}>
            <span style={{ fontWeight: 500 }}>
              {article.author?.username || 'Unknown'}
            </span>
            <span style={{ color: '#666', fontSize: '1rem' }}>
              {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'Unknown date'}
            </span>
          </div>
          <img 
            src={article.author?.image || 'https://via.placeholder.com/50'} 
            alt="Author" 
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    ))}

          <Pagination
            current={currentPage}
            pageSize={ARTICLES_PER_PAGE}
            total={totalArticles}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </div>
  );
};

export default Home;