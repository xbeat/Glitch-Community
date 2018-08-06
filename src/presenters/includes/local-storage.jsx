import React from 'react';
import PropTypes from 'prop-types';

export default class LocalStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: undefined};
    this.handleStorage = this.handleStorage.bind(this);
  }
  
  handleStorage() {
    let value;
    try {
      value = JSON.parse(window.localStorage.getItem(this.props.name));
    } catch (error) {
      console.error('Failed to read from localStorage!', error);
      value = undefined;
    }
    this.setState({value});
  }
  
  componentDidMount() {
    window.addEventListener('storage', this.handleStorage, {passive: true});
    this.handleStorage();
  }
  
  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorage, {passive: true});
  }
  
  set(value) {
    try {
      window.localStorage.setItem(this.props.name, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to write to localStorage!', error);
    }
    this.setState({value});
  }
  
  render() {
    return this.props.children(
      this.state.value !== undefined ? this.state.value : this.props.default,
      this.set.bind(this)
    );
  }
}
LocalStorage.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  default: PropTypes.any,
};