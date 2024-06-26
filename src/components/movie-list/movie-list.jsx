/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'
import MovieItem from '../movie/movie'
import './movie-list.scss'

const MovieList = ({ moviesData, onRate }) => {
  const elem = moviesData.length ? moviesData.map((item) => (
    <MovieItem
      key={item.id}
      img={item.poster_path}
      title={item.title}
      overview={item.overview}
      date={item.release_date}
      genreId={item.genre_ids}
      vote={item.vote_average}
      idForRate={item.id}
      onRate={onRate}
    />
  )) : false
  const error = <Alert message="No rated movies was found, please rate some movies" type="error" showIcon />
  return <ul className="all-content">{!elem.length ? error : elem}</ul>
}

MovieList.defaultProps = {
  moviesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      poster_path: PropTypes.string,
      title: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      release_date: PropTypes.string.isRequired,
      genre_ids: PropTypes.arrayOf(PropTypes.number),
      vote_average: PropTypes.number.isRequired,
    })
  ),
  onRate: PropTypes.func.isRequired,
}
export default MovieList
