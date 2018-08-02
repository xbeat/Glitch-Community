/* global notify */

import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';

import ErrorHandlers from './error-handlers.jsx';
import Uploader from './includes/uploader.jsx';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

class TeamEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialTeam,
      _cacheAvatar: Date.now(),
      _cacheCover: Date.now(),
    };
  }

  currentUserIsOnTeam() {
    const currentUserId = this.props.currentUserModel.id();
    return this.state.users.some(({id}) => currentUserId === id);
  }

  async updateFields(changes) {
    const {data} = await this.props.api.patch(`teams/${this.state.id}`, changes);
    this.setState(data);
  }

  async uploadAvatar(blob) {
    const {data: policy} = await assets.getTeamAvatarImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasAvatarImage: true,
      backgroundColor: color,
    });
    this.setState({_cacheAvatar: Date.now()});
  }

  async uploadCover(blob) {
    const {data: policy} = await assets.getTeamCoverImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    this.setState({_cacheCover: Date.now()});
  }

  async addUser(id) {
    await this.props.api.post(`teams/${this.state.id}/users/${id}`);
    this.setState(({users}) => ({
      users: [...users, user],
    }));
  }

  async removeUser(id) {
    await this.props.api.delete(`teams/${this.state.id}/users/${id}`);
    this.setState(({users}) => ({
      users: users.filter(u => u.id !== id),
    }));
    if (id === this.props.currentUserModel.id()) {
      const model = this.props.currentUserModel;
      model.teams(model.teams().filter(({id}) => id() !== this.props.team.id));
    }
  }

  async updateUserPermissions(id, accessLevel) {
    if (accessLevel === MEMBER_ACCESS_LEVEL && this.state.adminIds.length <= 1) {
      notify.createNotification(<div>A team must have at least one admin</div>, 'notifyError');
      return false;
    }
    await this.props.api.patch(`teams/${this.state.id}/users/${id}`, {accessLevel: accessLevel});
    if (accessLevel === ADMIN_ACCESS_LEVEL) {
      this.setState((prevState) => ({
        counter: prevState.adminIds.push(id)
      }));
    } else {
      let index = this.state.adminIds.indexOf(id);
      this.setState((prevState) => ({
        counter: prevState.adminIds.splice(index, 1)
      }));
    }
  }

  async addProject(id) {
    await this.props.api.post(`teams/${this.state.id}/projects/${id}`);
    this.setState(({projects}) => ({
      projects: [project, ...projects],
    }));
  }

  async removeProject(id) {
    await this.props.api.delete(`teams/${this.state.id}/projects/${id}`);
    this.setState(({projects}) => ({
      projects: projects.filter(p => p.id !== id),
    }));
  }

  async addPin(id) {
    await this.props.api.post(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(({teamPins}) => ({
      teamPins: [...teamPins, {projectId: id}],
    }));
  }

  async removePin(id) {
    await this.props.api.delete(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(({teamPins}) => ({
      teamPins: teamPins.filter(p => p.projectId !== id),
    }));
  }

  currentUserIsTeamAdmin() {
    const currentUserId = this.props.currentUserModel.id();
    if (this.state.adminIds.includes(currentUserId)) {
      return true;
    }
    return false;
  }

  // TODO temp feature switch name // features will eventually return an object instead
  teamHasUnlimitedProjects() {
    let features = this.props.initialTeam.features;
    return features.includes('unlimited projects');
  }

  teamHasBillingExposed() {
    let features = this.props.initialTeam.features;
    return features.includes('billing exposed');
  }

  render() {
    const {handleError} = this.props;
    const funcs = {
      updateDescription: description => this.updateFields({description}).catch(handleError),
      addUser: id => this.addUser(id).catch(handleError),
      removeUser: id => this.removeUser(id).catch(handleError),
      uploadAvatar: () => assets.requestFile(blob => this.uploadAvatar(blob).catch(handleError)),
      uploadCover: () => assets.requestFile(blob => this.uploadCover(blob).catch(handleError)),
      clearCover: () => this.updateFields({hasCoverImage: false}).catch(handleError),
      addProject: id => this.addProject(id).catch(handleError),
      removeProject: id => this.removeProject(id).catch(handleError),
      addPin: id => this.addPin(id).catch(handleError),
      removePin: id => this.removePin(id).catch(handleError),
      teamHasUnlimitedProjects: this.teamHasUnlimitedProjects(),
      teamHasBillingExposed: this.teamHasBillingExposed(),
      updateUserPermissions: (id, accessLevel) => this.updateUserPermissions(id, accessLevel).catch(handleError),
    };
    return this.props.children(this.state, funcs, this.currentUserIsOnTeam(), this.currentUserIsTeamAdmin());
  }
}
TeamEditor.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  handleError: PropTypes.func.isRequired,
  initialTeam: PropTypes.object.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

const TeamEditorContainer = ({api, children, currentUserModel, initialTeam}) => (
  <ErrorHandlers>
    {errorFuncs => (
      <Uploader>
        {uploadFuncs => (
          <TeamEditor {...{api, currentUserModel, initialTeam}} {...uploadFuncs} {...errorFuncs}>
            {children}
          </TeamEditor>
        )}
      </Uploader>
    )}
  </ErrorHandlers>
);
TeamEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialTeam: PropTypes.object.isRequired,
};

export default TeamEditorContainer;