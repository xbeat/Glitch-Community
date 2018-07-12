import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets.js';

class UserEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialUser,
      _deletedProjects: [],
      _cacheCover: Date.now(),
    };
  }
  
  updateFields(changes) {
    return this.props.api.patch(`users/${this.state.id}`, changes).then(({data}) => {
      this.setState(data);
    });
  }
  
  updateName(name) {
    return this.updateFields({name}).then(() => {
      this.props.userModel.name(name);
    }, ({response: {data: {message}}}) => Promise.reject(message)
    );
  }
  
  updateLogin(login) {
    return this.updateFields({login}).then(() => {
      history.replaceState(null, null, `/@${login}`);
      document.title = `@${login}`;
      this.props.userModel.login(login);
    }, ({response: {data: {message}}}) => Promise.reject(message));
  }
  
  isCurrentUser() {
    return this.state.id === this.props.currentUserId;
  }
  
  async uploadAvatar(blob) {
    try {
      const {id} = this.props.user;
      const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
      const url = await this.props.uploadAsset(blob, policy, 'temporary-user-avatar');

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.updateFields({
        avatarUrl: url,
        color: color,
      });
    } catch (error) {
      console.error(error);
    }
    if (
    this.props.userModel.avatarUrl(this.props.user.avatarUrl);
    this.props.userModel.avatarThumbnailUrl(this.props.user.avatarThumbnailUrl);
  }
  
  async uploadCover(blob) {
    try {
      const {id} = this.state;
      const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
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
  
  async pinProject(id) {
    return this.props.api.post(`users/${this.state.id}/pinned-projects/${id}`).then(() => {
      this.setState(({pins}) => ({
        pins: [...pins, {projectId: id}],
      }));
    });
  }
  
  async unpinProject(id) {
    return this.props.api.delete(`users/${this.state.id}/pinned-projects/${id}`).then(() => {
      this.setState(({pins}) => ({
        pins: pins.filter(p => p.projectId !== id),
      }));
    });
  }
  
  async leaveProject(id) {
    await this.props.api.delete(`/projects/${id}/authorization`, {
      data: {
        targetUserId: this.state.id,
      },
    });
    this.setState(({projects}) => ({
      projects: projects.filter(p => p.id !== id),
    }));
  }
  
  async deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    const {data} = await this.props.api.get(`projects/${id}?showDeleted=true`);
    this.setState(({projects, deletedProjects}) => ({
      projects: projects.filter(p => p.id !== id),
      deletedProjects: [data, ...deletedProjects]
    }));
  }
  
  async undeleteProject(id) {
    await this.props.api.post(`/projects/${id}/undelete`);
    const {data} = await this.props.api.get(`projects/${id}`);
    if (data.domain.endsWith('-deleted')) {
      try {
        const newDomain = data.domain.replace(/-deleted$/, '');
        await this.props.api.patch(`/projects/${id}`, {
          domain: newDomain,
        });
        data.domain = newDomain;
      } catch (e) {
        console.warn(e);
      }
    }
    this.setState(({projects, deletedProjects}) => ({
      projects: [...projects, data],
      deletedProjects: deletedProjects.filter(p => p.id !== id)
    }));
  }
  
  render() {
    const funcs = {
      updateName: name => this.updateName(name),
      updateLogin: login => this.updateLogin(login),
      updateDescription: description => this.updateFields({description}),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => this.updateFields({hasCoverImage: false}),
      addPin: id => this.pinProject(id),
      removePin: id => this.unpinProject(id),
      leaveProject: id => this.leaveProject(id),
      deleteProject: id => this.deleteProject(id),
      undeleteProject: id => this.undeleteProject(id),
      setDeletedProjects: deletedProjects => this.setState({deletedProjects}),
    };
    return this.props.children(this.state, funcs, this.state.id === this.props.currentUserId);
  }
}
UserEditor.propTypes = {
  children: PropTypes.func.isRequired,
  currentUserId: PropTypes.number.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  uploadAsset: PropTypes.func.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

export default ({children, initialUser}) => (
);