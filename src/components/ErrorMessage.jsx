import React, { useState } from 'react'

const ErrorMessage = ({ message }) => {
  const [visible, setVisible] = useState(true)

  if (!visible || !message) return null

  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={() => setVisible(false)} className="close-button">✕</button>
    </div>
  )
}

export default ErrorMessage