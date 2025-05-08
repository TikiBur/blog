import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/SignUp.css';

const SignUp = React.memo(() => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useUser();
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);

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

    const userPayload = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password
      }
    };

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      const result = await res.json();

      if (!res.ok) {
        throw result.errors;
      }

      login(result.user, result.user.token);
      setFlashMessage({ type: 'success', text: 'Registration successful!' });
      setTimeout(() => navigate('/'), 1500);
    } catch (errors) {
      setServerErrors(errors || {});
      setFlashMessage({ type: 'error', text: 'Registration failed. Please check your data.' });
      console.error('Ошибка регистрации', errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '938px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '21px' }}>Create new account</h2>

      {flashMessage && (
        <div className={`flash-message ${flashMessage.type}`}>
          {flashMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '48px 32px', background: '#fff', borderRadius: '6px' }}>
        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
          <input
            placeholder="Username"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.username || serverErrors.username ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('username', { 
              required: 'Обязательное поле',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа'
              },
              maxLength: {
                value: 20,
                message: 'Максимум 20 символов'
              }
            })}
            disabled={isLoading}
          />
          {errors.username && <div className="error-text">{errors.username.message}</div>}
          {serverErrors.username && <div className="error-text">{serverErrors.username.join(', ')}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email address</label>
          <input
            placeholder="Email address"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.email || serverErrors.email ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('email', {
              required: 'Обязательное поле',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Некорректный email'
              }
            })}
            disabled={isLoading}
          />
          {errors.email && <div className="error-text">{errors.email.message}</div>}
          {serverErrors.email && <div className="error-text">{serverErrors.email.join(', ')}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            placeholder="Password"
            type="password"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.password || serverErrors.password ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('password', { 
              required: 'Обязательное поле',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.'
              },
              maxLength: {
                value: 40,
                message: 'Максимум 40 символов'
              }
            })}
            disabled={isLoading}
          />
          {errors.password && <div className="error-text">{errors.password.message}</div>}
          {serverErrors.password && <div className="error-text">{serverErrors.password.join(', ')}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Repeat Password</label>
          <input
            placeholder="Repeat Password"
            type="password"
            style={{ 
              width: '100%',
              padding: '8px 12px',
              border: errors.repeatPassword ? '1px solid #F5222D' : '1px solid #D9D9D9',
              borderRadius: '4px'
            }}
            {...register('repeatPassword', {
              required: 'Обязательное поле',
              validate: (value) => 
                value === watch('password') || 'Passwords must match'
            })}
            disabled={isLoading}
          />
          {errors.repeatPassword && <div className="error-text">{errors.repeatPassword.message}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: '21px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              style={{ width: '16px', height: '16px' }}
              {...register('agree', { 
                required: 'Необходимо ваше согласие'
              })}
              disabled={isLoading}
            />
            <span>I agree to the processing of my personal information</span>
          </label>
          {errors.agree && <div className="error-text">{errors.agree.message}</div>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ 
            width: '100%',
            padding: '8px 12px',
            background: '#1890FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Регистрация...' : 'Create'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/sign-in">Sign In</Link>
      </div>
    </div>
  );
});

SignUp.propTypes = {
  register: PropTypes.func,
  handleSubmit: PropTypes.func,
  errors: PropTypes.object,
  watch: PropTypes.func,
  login: PropTypes.func.isRequired
};

export default SignUp;