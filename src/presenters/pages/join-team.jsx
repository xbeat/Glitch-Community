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
      await this.props.api.post(`/teams/${team.id}/join/${this.props.joinToken}`);
      this.props.createNotification('Invitation accepted');
    } catch (error) {
      // The team is real but the token didn't work
      // Maybe it's been used already or expired?
      console.log('Team invite error', error && error.response && error.response.data);
      Raven.captureMessage('Team invite error', {extra: {error}});
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
  createNotification: PropTypes.func.isRequired,
};

export const JoinTeamPage = (props) => (
  <NotificationsConsumer>
    {notify => <JoinTeamPageBase {...notify} {...props}/>}
  </NotificationsConsumer>
);

export default JoinTeamPage;