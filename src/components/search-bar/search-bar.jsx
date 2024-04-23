/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import { Component } from 'react'
import './search-bar.css'

function debounce(func, ms) {
  let timeout
  // eslint-disable-next-line func-names
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), ms)
  }
}

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.onLabelChange = this.onLabelChange.bind(this)
    this.state = {
      label: '',
    }
    this.updateLabelDebounced = debounce(this.props.updateLabel, 300);
  }

  onLabelChange(e) {
    const value = e.target.value
    this.setState({ label: value }, () => {
        this.updateLabelDebounced(value);
    })
  }

  render() {
    return (
      <form>
        <input
          className="search"
          placeholder="Type to search..."
          onChange={this.onLabelChange}
          value={this.state.label}
        />
      </form>
    )
  }
}
