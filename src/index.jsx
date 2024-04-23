/* eslint-disable react/destructuring-assignment */
import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Pagination } from 'antd';
import MovieList from './components/movie-list'
import SearchBar from './components/search-bar/search-bar'
// eslint-disable-next-line import/no-unresolved, import/extensions
import MovieService from './services/movie-service'
// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  // eslint-disable-next-line react/no-unused-class-component-methods
  MovieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      label: '',
      page: 1
    } 
  }

  // eslint-disable-next-line class-methods-use-this
  onChangePagination = (page) => {
    this.setState({
      page
    })
  }

  updateLabel = (text) => {
    this.setState({ 
      label: text,
    })
    if(text.length === 0) {
      this.setState({
        page: 1
      })
    }
  }

  render() {
    const {label, page} = this.state
    return (
      <>
        <SearchBar updateLabel={this.updateLabel}/>   
        <MovieList label={label} page={page} />
        <Pagination current={page} total={48} onChange={this.onChangePagination}/>
      </>
    )
  }
}

const rootHTML = document.getElementById('root')
const root = createRoot(rootHTML)
root.render(<App />)
