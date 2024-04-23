/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import { Spin, Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import photo from './ad16f84b4351c548ad40efff6081bd5e.png'
import './movie-list.css'
import MovieService from '../../services/movie-service'

export default class MovieList extends Component {
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
    }
  }

  componentDidMount() {
    this.updateMovie()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.label !== this.props.label) {
      this.updateMovie()
    }
    if (prevProps.page !== this.props.page) {
      this.updateMovie()
    }
  }

  // eslint-disable-next-line class-methods-use-this
  maxId = () => Math.random().toString(36).slice(2)

  onError = () => {
    this.setState({
      error: true,
      loading: false,
      isResults: true,
    })
  }

  updateMovie() {
    // eslint-disable-next-line react/prop-types
    const { label, page } = this.props
    this.MovieService.getResource(page, label)
      .then((movies) => {
        const movieComponents = movies.map((movie) => (
          <MovieLi
            key={this.maxId()}
            title={movie.title}
            overview={movie.overview}
            releaseDate={movie.release_date}
            posterURL={movie.poster_path}
          />
        ))
        this.setState({
          movieComponents,
          loading: false,
          isResults: true,
        })

        if (movies.length <= 0) {
          this.setState({
            isResults: false,
          })
        }
      })
      .catch(this.onError)
  }

  render() {
    const { movieComponents, loading, error, isResults } = this.state

    const hasData = !(loading || error)
    const errorMsg = error ? <Alert type="error" message="Something went wrong" description="Error" showIcon /> : null
    const errorNetwork = (
      <Alert type="error" message="Something went wrong" description="Check your ethernet connection" showIcon />
    )
    const errorResults = isResults ? (
      ''
    ) : (
      <Alert message="NO RESULTS" description="Sorry there is no results with this input" type="warning" />
    )
    const spinner = loading ? <Spin /> : null
    const content = hasData ? movieComponents : null

    return (
      <>
        <Online>
          <ul className="list">
            {errorResults}
            {errorMsg}
            {spinner}
            {content}
          </ul>
        </Online>
        <Offline>{errorNetwork}</Offline>
      </>
    )
  }
}

// eslint-disable-next-line react/prop-types
function MovieLi({ title, overview, releaseDate, posterURL }) {
  // eslint-disable-next-line prefer-template
  const url = 'https://image.tmdb.org/t/p/w500' + posterURL
  const check = posterURL == null ? 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' : url
  return (
    <>
      {}
      <li className="frame">
        <img src={check} alt={photo} className="img-movie" />
        <p className="header-text">{title}</p>
        <p className="date-text">{releaseDate}</p>
        <button type="button" className="btn-action">
          Action
        </button>
        <button type="button" className="btn-drama">
          Drama
        </button>
        <p className="description-text">{overview}</p>
      </li>
    </>
  )
}
