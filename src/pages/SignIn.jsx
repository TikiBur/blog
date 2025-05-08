import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import '../styles/SignUp.css'

const SignIn = React.memo(() => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useUser()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)

  const onSubmit = async (data) => {
    setServerErrors({})
    setIsLoading(true)

    const userPayload = {
      user: {
        email: data.email,
        password: data.password
      }
    }

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      })

      const result = await res.json()

      if (!res.ok) {
        throw result.errors
      }

      login(result.user, result.user.token)
      setFlashMessage({ type: 'success', text: 'Login successful!' })
      setTimeout(() => navigate('/'), 1500)
    } catch (errors) {
      if (errors['email or password']) {
        setServerErrors({ email: ['Неверный email или пароль'], password: ['Неверный email или пароль'] })
      } else if (errors.email) {
        setServerErrors({ email: errors.email })
      } else if (errors.password) {
        setServerErrors({ password: errors.password })
      } else {
        setServerErrors({ general: ['Ошибка входа. Попробуйте позже'] })
      }
      setFlashMessage({ type: 'error', text: 'Login failed. Please check your data.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="form-container" style={{ maxWidth: '938px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '21px' }}>Вход</h2>
      
      {flashMessage && (
        <div className={`flash-message ${flashMessage.type}`}>
          {flashMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '48px 32px', background: '#fff', borderRadius: '6px' }}>
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
              }
            })}
            disabled={isLoading}
          />
          {errors.password && <div className="error-text">{errors.password.message}</div>}
          {serverErrors.password && <div className="error-text">{serverErrors.password.join(', ')}</div>}
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
          {isLoading ? 'Вход...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <Link to="/sign-up">Sign Up</Link>
      </div>
    </div>
  )
})

SignIn.propTypes = {
  register: PropTypes.func,
  handleSubmit: PropTypes.func,
  errors: PropTypes.object,
  login: PropTypes.func.isRequired
}

export default SignIn