/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-restricted-globals */

import React, { useState, useEffect } from 'react'
import './app.scss'
import { Offline, Online } from 'react-detect-offline'
import { Input, Spin, Alert, Pagination, Tabs } from 'antd'
import { debounce } from 'lodash'
import MovieList from '../movie-list/movie-list'
import movieService from '../../services/movie-service'
import ErrorIndicator from '../error/error.tsx'
import { Provider } from '../context/context'

export default function App() {
  const [moviesData, setMoviesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('fight club')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPageRate, setCurrentPageRate] = useState(1)
  const [totalResultsRate, setTotalResultsRate] = useState(0)
  const [genres, setGenres] = useState([])
  const [rate, setRate] = useState([])

  const getDataMovies = async () => {
    if (searchQuery.trim().length === 0) {
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await movieService.getMovies(searchQuery, currentPage)
      setTotalResults(data.total_pages)
      setMoviesData(data.results)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const loadRatedMovies = async (page) => {
    try {
      setLoading(true)
      setError(null)
      const data = await movieService.getRatedMovies(page)
      setTotalResultsRate(data.total_results)
      setRate(data.results)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const onPaginationChange = (page) => {
    setCurrentPage(page)
  }

  const onPaginationChangeRate = (page) => {
    setCurrentPageRate(page)
    loadRatedMovies(page)
  }

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    const debouncedGetDataMovies = debounce(() => getDataMovies(), 600)
    debouncedGetDataMovies()

    return () => {
      debouncedGetDataMovies.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage])

  useEffect(() => {
    const load = async () => {
      if (!movieService.getLocalGuestSessionToken()) {
        const session = await movieService.getQuestSession()
        movieService.setLocalGuestSessionToken(session.guest_session_id)
      }

      const dataGenre = await movieService.getGenres()

      setGenres(dataGenre.genres)
    }

    load()
  }, [])

  const onRate = async (id, value) => {
    if (value > 0) {
      await movieService.postMovieRating(id, value)
      movieService.setLocalRating(id, value)
    } else {
      await movieService.deleteRating(id)
      localStorage.removeItem(id)
    }
  }
  const spinner = loading ? <Spin /> : null
  const content = !loading ? <MovieList moviesData={moviesData} onRate={onRate} /> : null
  const errorIndicator = error ? <ErrorIndicator /> : null
  const paginationPanelSearch =
    !loading && !error && searchQuery ? (
      <Pagination
        current={currentPage}
        total={totalResults * 10}
        onChange={onPaginationChange}
        pageSize={10}
        showSizeChanger={false} 
      />
    ) : null  
  const paginationPanelRated = !error ? (
    <Pagination
      defaultCurrent={1}
      current={currentPageRate}
      total={totalResultsRate}
      onChange={onPaginationChangeRate}
      pageSize={20}
      showSizeChanger={false}
      hideOnSinglePage
    />
  ) : null

  if (moviesData.length === 0 && searchQuery.length !== 0 && !loading && !error) {
    return (
      <>
        <Input placeholder="Type to search..." onChange={onSearchChange} value={searchQuery} autoFocus />
        <Alert message="No results found" type="error" showIcon />
      </>
    )
  }

  const onTabsChange = async (active) => {
    if (active === '2') {
      const ratedMovies = await movieService.getRatedMovies()
      if (ratedMovies !== null && ratedMovies.results !== undefined) {
        setRate(ratedMovies.results)
      }
      loadRatedMovies(1)
    }
    if (active === '1') {
      getDataMovies()
    }
  }

  const items = [
    {
      key: '1',
      label: `Search`,
      children: (
        <>
          <Input placeholder="Type to search..." onChange={onSearchChange} />
          {spinner}
          {content}
          {errorIndicator}
          <div className='pag'>{paginationPanelSearch}</div>
        </>
      ),
    },
    {
      key: '2',
      label: `Rated`,
      children: (
        <>
          <MovieList moviesData={rate} onRate={onRate} />
          <div className='pag'>{paginationPanelRated}</div>
        </>
      ),
    },
  ]
  return (
    <div className="main">
      <Provider value={genres}>
        <Online>
          <Tabs defaultActiveKey="1" items={items} onChange={onTabsChange} />
        </Online>
        <Offline>
          <Alert message="Damn dude its 2024 and u got no money for the internet?" type="error" />
        </Offline>
      </Provider>
    </div>
  )
}
