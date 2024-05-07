/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react'
import MovieItem from '../movie/movie.tsx'
import './movie-list.scss'
import { MovieData } from '../../types/types.ts'

interface MovieListProps {
  moviesData: MovieData[]
  onRate: (id: number, rating: number) => void
}

const MovieList: React.FC<MovieListProps> = ({ moviesData, onRate }) => {
  const maxId: Function = (): string => Math.random().toString(36).slice(2)

  const elem = moviesData.map((item: MovieData) => (
    <MovieItem
      key={maxId()}
      img={item.poster_path}  
      title={item.title}
      overview={item.overview}
      date={item.release_date}
      genreId={item.genre_ids}
      vote={item.vote_average}
      idForRate={item.id}
      onRate={onRate}
    />
  ))
  return <ul className="all-content">{elem === undefined ? null : elem}</ul>
}

export default MovieList
