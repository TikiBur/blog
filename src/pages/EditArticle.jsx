import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { useUser } from '../context/UserContext';
import { Spin } from 'antd';

const API_URL = 'https://blog-platform.kata.academy/api';

const EditArticle = () => {
  const { slug } = useParams();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tagInputs, setTagInputs] = useState(['', '']);

  // Сохранение данных в localStorage
  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Получение данных из localStorage
  const getFromLocalStorage = (key) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  };

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    setAuthChecked(true);

    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/articles/${slug}`);
        if (!res.ok) throw new Error('Ошибка загрузки статьи');
        
        const data = await res.json();
        if (!data.article) throw new Error('Статья не найдена');

        // Устанавливаем значения из localStorage или API
        setValue('title', getFromLocalStorage('title') || data.article.title);
        setValue('description', getFromLocalStorage('description') || data.article.description);
        setValue('body', getFromLocalStorage('body') || data.article.body);

        // Для тегов проверяем localStorage и API
        const storedTags = getFromLocalStorage('tags');
        setTagInputs(
          storedTags || 
          (data.article.tagList.length > 0 ? data.article.tagList : ['', ''])
        );

        // Сохраняем начальные значения в localStorage
        if (!getFromLocalStorage('title')) {
          saveToLocalStorage('title', data.article.title);
          saveToLocalStorage('description', data.article.description);
          saveToLocalStorage('body', data.article.body);
          saveToLocalStorage('tags', data.article.tagList.length > 0 ? data.article.tagList : ['', '']);
        }
      } catch (error) {
        setServerError(error.message || 'Ошибка при загрузке статьи');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, setValue, token, navigate]);

  // Обработчики изменений полей
  const handleInputChange = (key, value) => {
    saveToLocalStorage(key, value);
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tagInputs];
    newTags[index] = value;
    setTagInputs(newTags);
    saveToLocalStorage('tags', newTags);
  };

  const addTagInput = () => {
    const newTags = [...tagInputs, ''];
    setTagInputs(newTags);
    saveToLocalStorage('tags', newTags);
  };

  const removeTagInput = (index) => {
    if (tagInputs.length <= 1) return;
    const newTags = [...tagInputs];
    newTags.splice(index, 1);
    setTagInputs(newTags);
    saveToLocalStorage('tags', newTags);
  };

  const onSubmit = async (data) => {
    setServerError(null);
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
      const res = await fetch(`${API_URL}/articles/${slug}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(articlePayload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw result.errors || new Error('Ошибка обновления статьи');
      }

      // Очищаем localStorage после успешного обновления
      localStorage.removeItem('title');
      localStorage.removeItem('description');
      localStorage.removeItem('body');
      localStorage.removeItem('tags');

      navigate(`/articles/${slug}`);
    } catch (errors) {
      setServerError(
        typeof errors === 'object' 
          ? Object.values(errors).join(', ') 
          : 'Ошибка редактирования статьи'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked || isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <div className="form-container" style={{ maxWidth: '938px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '21px' }}>Edit article</h2>
      {serverError && <ErrorMessage message={serverError} />}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '48px 32px', background: '#fff', borderRadius: '6px' }}>
        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
          <input
            placeholder='Title'
            type="text"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.title ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('title', { required: 'Заголовок обязателен' })}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={isLoading}
          />
          {errors.title && <ErrorMessage message={errors.title.message} />}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Short description</label>
          <input
            placeholder='Description'
            type="text"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.description ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('description', { required: 'Описание обязательно' })}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={isLoading}
          />
          {errors.description && <ErrorMessage message={errors.description.message} />}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Text</label>
          <textarea
            placeholder='Text'
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.body ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px',
              minHeight: '168px'
            }}
            {...register('body', { required: 'Текст обязателен' })}
            onChange={(e) => handleInputChange('body', e.target.value)}
            disabled={isLoading}
          />
          {errors.body && <ErrorMessage message={errors.body.message} />}
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
          {isLoading ? 'Редактирование...' : 'Update article'}
        </button>
      </form>
    </div>
  );
};

export default EditArticle;