/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './movie.scss'
import { format } from 'date-fns'
import { Progress, Rate } from 'antd'
import { Consumer } from '../context/context'
import movieService from '../../services/movie-service'

function Movie({ img, title, overview, date, genreId, vote, idForRate, onRate }) {
  const [rating, setRating] = useState(0)

  const maxId = () => Math.random().toString(36).slice(2)

  useEffect(() => {
    setRating(movieService.getLocalRating(idForRate))
  }, [idForRate])

  function cutText(str) {
    const truncatedText = str.replace(/^(.{0,90}\S*).*$/, '$1')
    return `${truncatedText}...`
  }

  return (
    <Consumer>
      {(genres) => (
        <li className="wrapper">
          <section className="visual">
            <img
              src={
                img
                  ? `https://image.tmdb.org/t/p/w500${img}`
                  : 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'
              }
              alt={title}
              height="280px"
              width="180px"
            />
          </section>
          <section className="content">
            <Progress
              type="circle"
              percent={vote * 10}
              format={(percent) => {
                if (!percent) {
                  return ''
                }
                return (percent / 10).toFixed(1)
              }}
              strokeColor={
                vote >= 0 && vote <= 3
                  ? '#E90000'
                  : vote > 3 && vote <= 5
                    ? '#E97E00'
                    : vote > 5 && vote <= 7
                      ? '#E9D100'
                      : '#66E900'
              }
              className="movie-info__rate"
            />
            <div className="box">
              <p className="box__title">{title}</p>
              <p className="box__date">{date ? format(new Date(date), 'MMM dd, yyyy') : 'No data'}</p>
              {genres.map((genre) => {
                if (genreId.includes(genre.id)) {
                  return (
                    <p className="box__genre" key={maxId()}>
                      {genre.name}
                    </p>
                  )
                }
                return null
              })}
              <p className="box__text">{cutText(overview)}</p>
            </div>
            <div className="box__star">
              <Rate
                allowHalf
                count={10}
                value={rating}
                onChange={(star) => {
                  onRate(idForRate, star)
                  setRating(star)
                }}
              />
            </div>
          </section>
        </li>
      )}
    </Consumer>
  )
}

Movie.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  date: PropTypes.string,
  genreId: PropTypes.arrayOf(PropTypes.number).isRequired,
  vote: PropTypes.number.isRequired,
  idForRate: PropTypes.number.isRequired,
  onRate: PropTypes.func.isRequired,
}
Movie.defaultProps = {
  img: '',
  date: '',
}

export default Movie
