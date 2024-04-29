/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './movie.scss'
import { format } from 'date-fns'
import { Progress, Rate } from 'antd'
import { Consumer } from '../context/context'
import movieService from '../../services/movie-service'

export default function Movie({ img, title, overview, date, genreId, vote, idForRate, onRate }) {
  const [rating, setRating] = useState(0)

  useEffect(() => {
    setRating(movieService.getLocalRating(idForRate))
  }, [idForRate])
  function cutText(str) {
    const truncatedText = str.replace(/^(.{0,90}\S*).*$/, '$1')
    return `${truncatedText}...`
  }

  function ratingColor(n) {
    switch (true) {
      case n >= 0 && n <= 3:
        return '#E90000'
      case n > 3 && n <= 5:
        return '#E97E00'
      case n > 5 && n <= 7:
        return '#E9D100'
      default:
        return '#66E900'
    }
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
              format={(percent) => (percent / 10).toFixed(1)}
              strokeColor={ratingColor(vote)}
              className="movie-info__rate"
            />
            <div className="box">
              <h1 className="box__title">{title}</h1>
              <p className="box__date">{date ? format(new Date(date), 'MMM dd, yyyy') : 'No data'}</p>
              {genres.map((el) => {
                if (genreId.includes(el.id)) {
                  return (
                    <p className="box__genre" key={el.id}>
                      {el.name}
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
