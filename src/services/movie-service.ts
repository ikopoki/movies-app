/* eslint-disable arrow-body-style */
const createMovieService = (apiKey: string) => {
  const apiBase = 'https://api.themoviedb.org/3'

  const getResource = async (url: string): Promise<any> => {
    const result = await fetch(`${apiBase}${url}`)
    if (!result.ok) {
      throw new Error(`Could not fetch ${url}, received ${result.status}`)
    }
    return result.json()
  }

  const getMovies = async (query: string = 'fight club', currentPage: number = 1): Promise<any> => {
    return getResource(`/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${currentPage}`)
  }

  const getGenres = async (): Promise<any> => {
    return getResource(`/genre/movie/list?api_key=${apiKey}&language=en-US`)
  }

  const getGuestSession = async (): Promise<any> => {
    const data = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`)
    return data.json()
  }

  const postMovieRating = async (movieId: number, rating: number): Promise<any> => {
    const token = localStorage.getItem('token')
    const data = await fetch(`${apiBase}/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    })
    return data.json()
  }

  const deleteRating = async (movieId: number): Promise<any> => {
    const token = localStorage.getItem('token')
    const data = await fetch(`${apiBase}/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
    return data
  }

  const getRatedMovies = async (page: number = 1): Promise<any> => {
    const token = localStorage.getItem('token')
    const data = await fetch(`${apiBase}/guest_session/${token}/rated/movies?api_key=${apiKey}&page=${page}`)
    return data.json()
  }

  const getLocalGuestSessionToken = (): string | null => {
    return localStorage.getItem('token')
  }

  const setLocalGuestSessionToken = (token: string): void => {
    localStorage.setItem('token', token)
  }

  const setLocalRating = (id: number, value: string): void => {
    localStorage.setItem(`Movie id: ${id}`, value)
  }

  const getLocalRating = (id: string): any => {
    return localStorage.getItem(id)
  }

  return {
    getMovies,
    getGenres,
    getGuestSession,
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
