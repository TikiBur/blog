const BASE_URL = 'https://blog-platform.kata.academy/api'

export const fetchArticles = async (page = 1, limit = 5) => {
  const offset = (page - 1) * limit
  const res = await fetch(`${BASE_URL}/articles?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error('Ошибка загрузки статей')
  return res.json()
}

export const fetchArticleBySlug = async (slug) => {
  const res = await fetch(`${BASE_URL}/articles/${slug}`)
  if (!res.ok) throw new Error('Ошибка загрузки статьи')
  return res.json()
}