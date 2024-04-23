/* eslint-disable no-underscore-dangle */
export default class MovieService {
  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGFkODUxZDFjNjY0ZjM4MTFkYmU4NzViMzYxYzE1ZiIsInN1YiI6IjY2MjEyNjViZTY0MGQ2MDE4NmMzNGQyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w1hF6JInPKwMncQAaQ0zNrFUyhsZtMnx2XMfDPZj8TI',
    },
  }

  // eslint-disable-next-line default-param-last
  async getResource(page, keyword) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=true&language=en-US&page=${page}`

    const res = await fetch(url, this._options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    const getMovie = await res.json()
    return getMovie.results
  }

  async getPages(keyword) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=true&language=en-US&page=1`

    const res = await fetch(url, this._options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    const getPages = await res.json()
    return getPages.total_pages
  }
}
