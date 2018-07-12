import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets.js';

import Notifications from './notifications.jsx';
import Uploader from './includes/uploader.jsx';

class UserEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialUser,
      _deletedProjects: [],
      _cacheCover: Date.now(),
    };
  }
  
  isCurrentUser() {
    return this.state.id === this.props.currentUserModel.id();
  }
  
  handleError(error) {
    console.error(error);
    this.props.createErrorNotification();
    return Promise.reject(error);
  }

  handleErrorForInput(error) {
    if (error && error.response && error.response.data) {
      return Promise.reject(error.response.data.message);
    }
    this.props.createErrorNotification();
    return Promise.reject();
  }
  
  updateFields(changes) {
    return this.props.api.patch(`users/${this.state.id}`, changes).then(({data}) => {
      this.setState(data);
    });
  }
  
  updateName(name) {
    return this.updateFields({name}).then(() => {
      if (this.isCurrentUser()) {
        this.props.currentUserModel.name(name);
      }
    }, this.handleErrorForInput.bind(this));
  }
  
  updateLogin(login) {
    return this.updateFields({login}).then(() => {
      history.replaceState(null, null, `/@${login}`);
      document.title = `@${login}`;
      if (this.isCurrentUser()) {
        this.props.currentUserModel.login(login);
      }
    }, this.handleErrorForInput.bind(this));
  }
  
  async uploadAvatar(blob) {
    const {id} = this.state;
    const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
    const url = await this.props.uploadAsset(blob, policy, 'temporary-user-avatar');

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      avatarUrl: url,
      color: color,
    });
    if (this.isCurrentUser()) {
      this.props.currentUserModel.avatarUrl(this.state.avatarUrl);
      this.props.currentUserModel.avatarThumbnailUrl(this.state.avatarThumbnailUrl);
    }
  }
  
  async uploadCover(blob) {
    const {id} = this.state;
    const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.props.updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    this.setState({_cacheCover: Date.now()});
  }
  
  addPin(id) {
    return this.props.api.post(`users/${this.state.id}/pinned-projects/${id}`).then(() => {
      this.setState(({pins}) => ({
        pins: [...pins, {projectId: id}],
      }));
    });
  }
  
  removePin(id) {
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
    this.setState(({projects, _deletedProjects}) => ({
      projects: projects.filter(p => p.id !== id),
      _deletedProjects: [data, ..._deletedProjects]
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
    this.setState(({projects, _deletedProjects}) => ({
      projects: [...projects, data],
      _deletedProjects: _deletedProjects.filter(p => p.id !== id)
    }));
  }
  
  render() {
    const handleError = this.handleError.bind(this);
    const funcs = {
      updateName: name => this.updateName(name),
      updateLogin: login => this.updateLogin(login),
      updateDescription: description => this.updateFields({description}).catch(handleError),
      uploadAvatar: () => assets.requestFile(blob => this.uploadAvatar(blob).catch(handleError)),
      uploadCover: () => assets.requestFile(blob => this.uploadCover(blob).catch(handleError)),
      clearCover: () => this.updateFields({hasCoverImage: false}).catch(handleError),
      addPin: id => this.addPin(id).catch(handleError),
      removePin: id => this.removePin(id).catch(handleError),
      leaveProject: id => this.leaveProject(id).catch(handleError),
      deleteProject: id => this.deleteProject(id).catch(handleError),
      undeleteProject: id => this.undeleteProject(id).catch(handleError),
      setDeletedProjects: _deletedProjects => this.setState({_deletedProjects}),
    };
    return this.props.children(this.state, funcs, this.isCurrentUser());
  }
}
UserEditor.propTypes = {
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  uploadAsset: PropTypes.func.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
};

const UserEditorContainer = ({api, children, currentUserModel, initialUser}) => (
  <Notifications>
    {notifyFuncs => (
      <Uploader>
        {uploadFuncs => (
          <UserEditor {...{api, currentUserModel, initialUser}} {...uploadFuncs} {...notifyFuncs}>
            {children}
          </UserEditor>
        )}
      </Uploader>
    )}
  </Notifications>
);
UserEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialUser: PropTypes.object.isRequired,
};

export default UserEditorContainer;