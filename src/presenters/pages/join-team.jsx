import React from 'react';
import PropTypes from 'prop-types';
/* global Raven */

import {Redirect} from 'react-router-dom';
import {getLink} from '../../models/team';
import NotificationsConsumer from '../notifications.jsx';

class JoinTeamPageBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }
  
  async componentDidMount() {
    try {
      var {data: team} = await this.props.api.get(`/teams/byUrl/${this.props.teamUrl}`);
    } catch (error) {
      Raven.captureException(error);
    }
    if (!team) {
      // Either the api is down or the team doesn't exist
      // Regardless we can't really do anything with this
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
      this.setState({redirect: getLink({url: this.props.teamUrl})});
      return;
    }
    try {
      var {data} = await this.props.api.post(`/teams/${team.id}/join/${this.props.joinToken}`);
    } catch (error) {
      // We know the team is real but the token failed
      // Maybe it's been used already or expired?
      const errorData = error && error.response && error.response.data;
      console.log('Team invite error', errorData);
      Raven.captureMessage('Team invite error', {extra: {error, errorData}});
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
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
JoinTeamPageBase.propTypes = {
  api: PropTypes.any.isRequired,
  teamUrl: PropTypes.string.isRequired,
  joinToken: PropTypes.string.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
};

export const JoinTeamPage = (props) => (
  <NotificationsConsumer>
    {notify => <JoinTeamPageBase {...notify} {...props}/>}
  </NotificationsConsumer>
);

export default JoinTeamPage;