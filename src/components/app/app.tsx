/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-restricted-globals */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import './app.scss'
import { Offline, Online } from 'react-detect-offline'
import { Input, Spin, Alert, Pagination, Tabs } from 'antd'
import MovieList from '../movie-list/movie-list.tsx'
import movieService from '../../services/movie-service.ts'
import ErrorIndicator from '../error/error.tsx'
import { Provider } from '../context/context.jsx'
import { Items, MovieData, MovieDataList } from '../../types/types.ts'

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): { run: (...args: Parameters<T>) => void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const run = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return { run, cancel }
}

export default function App(): React.JSX.Element {
  const [moviesData, setMoviesData] = useState<MovieData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState('fight  club')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPageRate, setCurrentPageRate] = useState(1)
  const [totalResultsRate, setTotalResultsRate] = useState(0)
  const [genres, setGenres] = useState< {id: number; name: string}[]>([])
  const [rate, setRate] = useState<MovieData[]>([])

  

  const getDataMovies = async (): Promise<any> => {
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
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  } 

  const loadRatedMovies = async (page: number): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const data = await movieService.getRatedMovies(page)
      setTotalResultsRate(data.total_results)
      setRate(data.results)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const onPaginationChange = (page: number): void => {
    setCurrentPage(page)
  }

  const onPaginationChangeRate = (page: number): void => {
    setCurrentPageRate(page)
    loadRatedMovies(page)
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    const { run, cancel } = debounce(() => getDataMovies(), 600)
    run()

    return () => {
      cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage])

  useEffect(() => {
      const load = async (): Promise<void> => {
        if (!movieService.getLocalGuestSessionToken()) {
          const session = await movieService.getGuestSession()
          movieService.setLocalGuestSessionToken(session.guest_session_id)
        }
  
        const dataGenre = await movieService.getGenres()
        const ratedMovies = await movieService.getRatedMovies()
        setRate(ratedMovies.results)
        setGenres(dataGenre.genres)
      }
  
      load()
  }, [])

  const onRate = async (id, value) => {
    if (value > 0) {
      await movieService.postMovieRating(id, value)
      movieService.setLocalRating(id, value)
      const ratedMovies = await movieService.getRatedMovies()
      setRate(ratedMovies.results)
    } else {
      await movieService.deleteRating(id)
      localStorage.removeItem(id)
      const ratedMovies = await movieService.getRatedMovies()
      setRate(ratedMovies.results)
    }
  }

  const spinner: React.ReactNode = loading ? <Spin /> : null
  const content: React.ReactNode = !loading ? <MovieList moviesData={moviesData} onRate={onRate} /> : null
  const errorIndicator: React.ReactNode = error ? <ErrorIndicator /> : null
  const paginationPanelSearch: React.ReactNode =
    !loading && !error && searchQuery ? (
      <Pagination
        className='pagination'
        current={currentPage}
        total={totalResults}
        onChange={onPaginationChange}
        pageSize={20}
        showSizeChanger={false}
      />
    ) : null

  const paginationPanelRated: React.ReactNode = !error ? (
    <Pagination
      className='pagination'
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

  const onTabsChange = (active: string) => {
    if (active === '2') {
      loadRatedMovies(currentPageRate)
    }
    if (active === '1') {
      getDataMovies()
    }
  }

  const items: Items[] = [
    {
      key: '1',
      label: `Search`,
      children: (
        <>
          <Input placeholder="Type to search..." onChange={onSearchChange} />
          {spinner}
          {content}
          {errorIndicator}
          {paginationPanelSearch}
        </>
      ),
    },
    {
      key: '2',
      label: `Rated`,
      children: (
        <>
          <MovieList moviesData={rate} onRate={onRate} />
          {paginationPanelRated}
        </>
      ),
    },
  ]

  return (
    <div className="main">
      <Provider value={genres}>
        <Online>
          <Tabs defaultActiveKey='1' items={items} onChange={onTabsChange} />
        </Online>
        <Offline>
          <Alert message="Damn dude its 2024 and u got no money for the internet?" type="error" />
        </Offline>
      </Provider>
    </div>
  )
}
