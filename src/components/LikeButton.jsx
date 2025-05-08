import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const LikeButton = ({ slug, favorited, favoritesCount, onLikeToggle }) => {
  const { token } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    if (!token) {
      alert('Необходимо войти в аккаунт для оценки статьи.');
      return;
    }

    setIsLoading(true);
    try {
      const method = favorited ? 'DELETE' : 'POST';
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
        method,
        headers: { 'Authorization': `Token ${token}` }
      });

      if (!res.ok) throw new Error('Ошибка при изменении лайка');

      if (onLikeToggle) onLikeToggle(!favorited);
    } catch (err) {
      alert('Ошибка при обновлении лайка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <button 
        onClick={toggleLike}
        disabled={isLoading}
        style={{ 
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontSize: '20px'
        }}
      >
        {favorited ? (
          <span role="img" aria-label="liked" style={{ color: 'red' }}>❤️</span>
        ) : (
          <span role="img" aria-label="not liked">🤍</span>
        )}
      </button>
      <span style={{ fontSize: '16px' }}>{favoritesCount}</span>
    </div>
  );
};

export default LikeButton;