import React from 'react';
import PropTypes from 'prop-types';
/* global Raven */

import {Redirect} from 'react-router-dom';
import {getLink} from '../../models/team';
import {CurrentUserConsumer} from '../current-user.jsx';
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
      if (error && !(error.response && error.response.status === 404)) {
        if(window.Raven) {
          Raven.captureException(error);
        }
      }
    }
    if (!team) {
      // Either the api is down or the team doesn't exist
      // Regardless we can't really do anything with this
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
      this.setState({redirect: getLink({url: this.props.teamUrl})});
      return;
    }
    try {
      // Suppress the authorization header to prevent user merging
      await this.props.api.post(`/teams/${team.id}/join/${this.props.joinToken}`, {}, { headers: { Authorization: '' } });
      this.props.createNotification('Invitation accepted');
    } catch (error) {
      // The team is real but the token didn't work
      // Maybe it's been used already or expired?
      console.log('Team invite error', error && error.response && error.response.data);
      if(window.Raven) {
        Raven.captureMessage('Team invite error', {extra: {error}});
      }
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
    }
    await this.props.reloadCurrentUser();
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
  reloadCurrentUser: PropTypes.func.isRequired,
};

export const JoinTeamPage = (props) => (
  <CurrentUserConsumer>
    {(currentUser, fetched, {reload}) => (
      <NotificationsConsumer>
        {notify => <JoinTeamPageBase {...notify} {...props} reloadCurrentUser={reload}/>}
      </NotificationsConsumer>
    )}
  </CurrentUserConsumer>
);

export default JoinTeamPage;