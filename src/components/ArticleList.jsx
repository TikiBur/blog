import React from 'react'
import ArticlePreview from './ArticlePage'

const ArticleList = ({ articles }) => {
  return (
    <div>
      {articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
    </div>
  )
}

export default ArticleList