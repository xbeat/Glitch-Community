import React from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';

class JoinTeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }
  
  async componentDidMount() {
  }
  
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect}/>;
    }
    return null;
  }
}
JoinTeamPage.propTypes = {
  api: PropTypes.any.isRequired,
  teamUrl: PropTypes.string.isRequired,
  joinToken: PropTypes.string.isRequired,
};

export default JoinTeamPage;