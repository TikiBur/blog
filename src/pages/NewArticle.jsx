import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Spin } from 'antd';
import '../styles/SignUp.css';

const NewArticle = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [authChecked, setAuthChecked] = useState(false);
  const [tagInputs, setTagInputs] = useState(['', '']);
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    } else {
      setAuthChecked(true);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const onSubmit = async (data) => {
    setServerErrors({});
    setIsLoading(true);

    const tags = tagInputs.filter(tag => tag.trim() !== '');

    const articlePayload = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: tags
      }
    };

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/articles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(articlePayload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw result.errors || new Error('Failed to create article');
      }

      setFlashMessage({ type: 'success', text: 'Article created successfully!' });
      setTimeout(() => navigate('/'), 1500);
    } catch (errors) {
      setFlashMessage({ type: 'error', text: 'Failed to create article' });
      if (typeof errors === 'object') {
        setServerErrors(errors);
      } else {
        setServerErrors({ general: ['Ошибка создания статьи'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tagInputs];
    newTags[index] = value;
    setTagInputs(newTags);
  };

  const addTagInput = () => {
    setTagInputs([...tagInputs, '']);
  };

  const removeTagInput = (index) => {
    if (tagInputs.length <= 1) return;
    const newTags = [...tagInputs];
    newTags.splice(index, 1);
    setTagInputs(newTags);
  };

  if (!authChecked) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <div className="form-container" style={{ maxWidth: '938px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '21px' }}>Create new article</h2>
      
      {flashMessage && (
        <div className={`flash-message ${flashMessage.type}`}>
          {flashMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '48px 32px', background: '#fff', borderRadius: '6px' }}>
        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
          <input
            placeholder='Title'
            type="text"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.title || serverErrors.title ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('title', { required: 'Обязательное поле' })}
            disabled={isLoading}
          />
          {errors.title && <div className="error-text">{errors.title.message}</div>}
          {serverErrors.title && <div className="error-text">{serverErrors.title.join(', ')}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Short description</label>
          <input
            placeholder='Description'
            type="text"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.description || serverErrors.description ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('description', { required: 'Обязательное поле' })}
            disabled={isLoading}
          />
          {errors.description && <div className="error-text">{errors.description.message}</div>}
          {serverErrors.description && <div className="error-text">{serverErrors.description.join(', ')}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Text</label>
          <textarea
            placeholder='Text'
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.body || serverErrors.body ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px',
              minHeight: '168px'
            }}
            {...register('body', { required: 'Обязательное поле' })}
            disabled={isLoading}
          />
          {errors.body && <div className="error-text">{errors.body.message}</div>}
          {serverErrors.body && <div className="error-text">{serverErrors.body.join(', ')}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tags</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {tagInputs.map((tag, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '17px' }}>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder="Tag"
                  disabled={isLoading}
                  style={{ 
                    width: '30%',
                    padding: '8px 12px',
                    border: '1px solid #D9D9D9',
                    borderRadius: '4px',
                    marginBottom: '0'
                  }}
                />
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => removeTagInput(index)}
                    style={{ 
                      width: '120px',
                      padding: '8px 12px',
                      background: 'white',
                      border: '1px solid #F5222D',
                      color: '#F5222D',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    disabled={isLoading || tagInputs.length <= 1}
                  >
                    Delete
                  </button>
                  {index === tagInputs.length - 1 && (
                    <button
                      type="button"
                      onClick={addTagInput}
                      style={{ 
                        width: '120px',
                        padding: '8px 12px',
                        background: 'white',
                        border: '1px solid #1890FF',
                        color: '#1890FF',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      disabled={isLoading}
                    >
                      Add tag
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {serverErrors.tagList && <div className="error-text">{serverErrors.tagList.join(', ')}</div>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '319px',
            padding: '8px 12px',
            background: '#1890FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'block'
          }}
        >
          {isLoading ? 'Создание...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default NewArticle;