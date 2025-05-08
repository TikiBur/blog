import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { useUser } from '../context/UserContext';
import { Spin } from 'antd';

const EditArticle = () => {
  const { slug } = useParams();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useUser();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tagInputs, setTagInputs] = useState(['', '']);

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    } else {
      setAuthChecked(true);
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`);
        const data = await res.json();
        setArticle(data.article);
        setValue('title', data.article.title);
        setValue('description', data.article.description);
        setValue('body', data.article.body);
        setTagInputs(data.article.tagList.length > 0 ? data.article.tagList : ['', '']);
      } catch (error) {
        setServerError('Ошибка загрузки статьи');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, setValue, token, navigate]);

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
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(articlePayload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw result.errors || new Error('Failed to update article');
      }

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

  if (!authChecked) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (isLoading) {
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