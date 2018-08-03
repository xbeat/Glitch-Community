import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext();

class UserPrefs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleStorage = this.handleStorage.bind(this);
  }
  
  handleStorage() {
    try {
      const prefs = window.localStorage['community-userPrefs'];
      this.setState(JSON.parse(prefs));
    } catch (error) {
      console.error('Failed to read prefs from localStorage!');
    }
  }
  
  componentDidMount() {
    window.addEventListener('storage', this.handleStorage, {passive: true});
    this.handleStorage();
  }
  
  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorage, {passive: true});
  }
  
  set(value) {
    this.setState({value});
    this.props.setUserPref(this.props.name, value);
  }
  
  render() {
    return this.props.children(this.state.value, this.set.bind(this));
  }
}
UserPref.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  default: PropTypes.any.isRequired,
  setUserPref: PropTypes.func.isRequired,
  getUserPref: PropTypes.func.isRequired,
};

export default UserPref;