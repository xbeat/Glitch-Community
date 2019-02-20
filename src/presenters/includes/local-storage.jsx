import React from 'react';
import PropTypes from 'prop-types';

export default class LocalStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: undefined, loaded: false };
    this.handleStorage = this.handleStorage.bind(this);
  }

  componentDidMount() {
    if (!this.props.ignoreChanges) {
      window.addEventListener('storage', this.handleStorage, { passive: true });
    }
    this.handleStorage();
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorage, {
      passive: true,
    });
  }

  handleStorage() {
    let value;
    try {
      const raw = window.localStorage.getItem(this.props.name);
      if (raw !== null) {
        value = JSON.parse(raw);
      }
    } catch (error) {
      console.error('Failed to read from localStorage!', error);
      value = undefined;
    }
    this.setState({ value, loaded: true });
  }

  set(value) {
    try {
      if (value !== undefined) {
        window.localStorage.setItem(this.props.name, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(this.props.name);
      }
    } catch (error) {
      console.error('Failed to write to localStorage!', error);
    }
    this.setState({ value });
  }

  render() {
    return this.props.children(
      this.state.value !== undefined ? this.state.value : this.props.default,
      this.set.bind(this),
      this.state.loaded,
    );
  }
}
LocalStorage.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  default: PropTypes.any,
  ignoreChanges: PropTypes.bool,
};

LocalStorage.defaultProps = {
  default: undefined,
  ignoreChanges: false,
};
