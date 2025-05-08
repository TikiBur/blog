import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const Profile = () => {
  const { user, login, logout } = useUser()
  const [serverError, setServerError] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.image || ''
    }
  })
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setServerError(null)

    const userPayload = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password || undefined,
        image: data.avatar || undefined
      }
    }

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${user.token}`
        },
        body: JSON.stringify(userPayload)
      })

      const result = await res.json()

      if (!res.ok) {
        throw result.errors
      }

      login(result.user, result.user.token)
      alert('Профиль успешно обновлён!')
      navigate('/')
    } catch (errors) {
      setServerError('Ошибка обновления профиля')
      console.error(errors)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="form-container">
      <h2>Редактировать профиль</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <label>Имя пользователя</label>
        <input
          {...register('username', { required: true, minLength: 3, maxLength: 20 })}
        />
        {errors.username && <span>Имя от 3 до 20 символов</span>}

        <label>Email</label>
        <input
          {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          })}
        />
        {errors.email && <span>Введите корректный email</span>}

        <label>Новый пароль</label>
        <input
          type="password"
          placeholder="Оставьте пустым, если не хотите менять"
          {...register('password', { minLength: 6, maxLength: 40 })}
        />
        {errors.password && <span>Пароль от 6 до 40 символов</span>}

        <label>Аватар (URL)</label>
        <input
          {...register('avatar', {
            pattern: {
              value: /^https?:\/\/[^\s$.?#].[^\s]*$/,
              message: 'Некорректный URL'
            }
          })}
        />
        {errors.avatar && <span>{errors.avatar.message}</span>}

        {serverError && <div className="error-message">{serverError}</div>}

        <button type="submit">Сохранить изменения</button>
        <button type="button" onClick={handleLogout} className="logout-btn">Выйти из аккаунта</button>
      </form>
    </div>
  )
}

export default Profile