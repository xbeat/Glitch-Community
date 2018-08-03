import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext();

class UserPref extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.default,
    };
    this.handleStorage = this.handleStorage.bind(this);
  }
  
  handleStorage() {
    const value = this.props.getUserPref(this.props.name);
    this.setState({
      value: value !== undefined ? value : this.props.default,
    });
  }
  
  componentDidMount() {
    this.handleStorage();
    window.addEventListener('storage', this.handleStorage, {passive: true});
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