import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';
import ProjectModel from '../models/project';
import UserModel from '../models/user';

class TeamEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialTeam,
      _cacheAvatar: Date.now(),
      _cacheCover: Date.now(),
    };
  }
  
  handleError(error) {
    console.error(error);
    this.props.createErrorNotification();
    return Promise.reject(error);
  }
  
  async updateFields(changes) {
    const {data} = await this.props.api.patch(`users/${this.state.id}`, changes);
    this.setState(data);
  }
  
  async uploadAvatar(blob) {
    try {
      const {id} = this.props.team;
      const {data: policy} = await assets.getTeamAvatarImagePolicy(this.props.api, id);
      await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        hasAvatarImage: true,
        backgroundColor: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({_cacheAvatar: Date.now()});
  }
  
  async uploadCover(blob) {
    try {
      const {id} = this.props.team;
      const {data: policy} = await assets.getTeamCoverImagePolicy(this.props.api, id);
      await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        hasCoverImage: true,
        coverColor: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({_cacheCover: Date.now()});
  }
  
  async addUser(id) {
    await this.props.api.post(`teams/${this.state.id}/users/${id}`);
    this.setState(({users}) => ({
      users: [...users, UserModel({id}).asProps()],
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
  
  async addProject(id) {
    await this.props.api.post(`teams/${this.state.id}/projects/${id}`);
    this.setState(({projects}) => ({
      projects: [...projects, ProjectModel({id}).asProps()],
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
  
  render() {
    const funcs = {
      updateDescription: description => this.updateFields({description}),
      addUser: id => this.addUser(id),
      removeUser: id => this.removeUser(id),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => this.updateFields({hasCoverImage: false}),
      addProject: id => this.addProject(id),
      removeProject: id => this.removeProject(id),
      addPin: id => this.addPin(id),
      removePin: id => this.removePin(id),
    };
    const currentUserId = this.props.currentUserModel.id();
    const currentUserIsOnTeam = this.state.users.some(({id}) => currentUserId === id);
    return this.props.children(this.state, funcs, currentUserIsOnTeam);
  }
}
TeamEditor.propTypes = {
  children: PropTypes.func.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialTeam: PropTypes.object.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};