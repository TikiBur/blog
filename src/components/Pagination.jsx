import React from 'react'

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div style={{ marginTop: '1rem' }}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          style={{
            margin: '0 4px',
            padding: '4px 8px',
            background: currentPage === i + 1 ? '#000' : '#fff',
            color: currentPage === i + 1 ? '#fff' : '#000',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

export default Pagination