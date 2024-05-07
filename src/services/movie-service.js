/* eslint-disable arrow-body-style */
const createMovieService = (apiKey) => {
  const apiBase = 'https://api.themoviedb.org/3'

  const getResource = async (url) => {
    const result = await fetch(`${apiBase}${url}`)
    if (!result.ok) {
      throw new Error(`Could not fetch ${url}, received ${result.status}`)
    }
    return result.json()
  }

  const getMovies = async (query = 'fight club', currentPage = 1) => {
    return getResource(
      `/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${currentPage}`,
    )
  }

  const getGenres = async () => {
    return getResource(`/genre/movie/list?api_key=${apiKey}&language=en-US`)
  }

  const getQuestSession = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`,
    )
    return data.json()
  }

  const postMovieRating = async (movieId, rating) => {
    const token = localStorage.getItem('token')
    const data = await fetch(
      `${apiBase}/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rating,
        }),
      },
    )
    return data.json()
  }

  const deleteRating = async (movieId) => {
    const token = localStorage.getItem('token')
    const data = await fetch(
      `${apiBase}/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${token}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    )
    return data
  }

  const getRatedMovies = async (page = 1) => {
    const token = localStorage.getItem('token')
    const data = await fetch(
      `${apiBase}/guest_session/${token}/rated/movies?api_key=${apiKey}&page=${page}`,
    )
    return data.status === 200 ? data.json() : null
  }

  const getLocalGuestSessionToken = () => {
    return localStorage.getItem('token')
  }

  const setLocalGuestSessionToken = (token) => {
    localStorage.setItem('token', token)
  }

  const setLocalRating = (id, value) => {
    localStorage.setItem(id, value)
  }

  const getLocalRating = (id) => {
    return +localStorage.getItem(id)
  }

  return {
    getMovies,
    getGenres,
    getQuestSession,
    postMovieRating,
    deleteRating,
    getRatedMovies,
    getLocalGuestSessionToken,
    setLocalGuestSessionToken,
    setLocalRating,
    getLocalRating,
  }
}

const movieService = createMovieService('f8ad851d1c664f3811dbe875b361c15f')

export default movieService
