import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import '../styles/global.css'

const Header = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/" className="logo">Realworld Blog</Link>

      <nav>
        {!user && (
          <>
            <Link to="/sign-in" className="nav-link">Sign In</Link>
            <Link to="/sign-up" className="nav-link signup">Sign Up</Link>
          </>
        )}

        {user && (
          <div className="user-controls">
            <Link to="/new-article" className="nav-link create">Create article</Link>
            <Link to="/profile" className="avatar-link">
              <img 
                src={user.image || '../src/assets/images/man.png'} 
                alt="avatar" 
                className="avatar" 
              />
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Log Out</button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header