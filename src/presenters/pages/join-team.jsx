import React from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';
import {getLink} from '../../models/team';

class JoinTeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }
  
  async componentDidMount() {
    const {data: team} = await this.props.api.get(`/teams/byUrl/${this.props.teamUrl}`);
    try {
      const {data} = await this.props.api.post(`/teams/${team.id}/join/${this.props.joinToken}`);
    } catch (error) {
    }
    this.setState({redirect: getLink(team)});
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