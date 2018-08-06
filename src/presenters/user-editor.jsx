import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';

import {CurrentUserProvider} from './current-user.jsx';
import ErrorHandlers from './error-handlers.jsx';
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
    return this.props.currentUser && (this.state.id === this.props.currentUser.id);
  }
  
  async updateFields(changes) {
    const {data} = await this.props.api.patch(`users/${this.state.id}`, changes);
    this.setState(data);
  }
  
  async updateName(name) {
    await this.updateFields({name});
    if (this.isCurrentUser()) {
      this.props.updateCurrentUser({name});
    }
  }
  
  async updateLogin(login) {
    await this.updateFields({login});
    if (this.isCurrentUser()) {
      this.props.currentUserModel.login(login);
    }
  }
  
  async uploadAvatar(blob) {
    const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, this.state.id);
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
    const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    this.setState({_cacheCover: Date.now()});
  }
  
  async addPin(id) {
    await this.props.api.post(`users/${this.state.id}/pinned-projects/${id}`);
    this.setState(({pins}) => ({
      pins: [...pins, {projectId: id}],
    }));
  }
  
  async removePin(id) {
    await this.props.api.delete(`users/${this.state.id}/pinned-projects/${id}`);
    this.setState(({pins}) => ({
      pins: pins.filter(p => p.projectId !== id),
    }));
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
        console.warn('failed to rename project on undelete', e);
      }
    }
    this.setState(({projects, _deletedProjects}) => ({
      projects: [...projects, data],
      _deletedProjects: _deletedProjects.filter(p => p.id !== id)
    }));
  }
  
  render() {
    const {handleError, handleErrorForInput} = this.props;
    const funcs = {
      updateName: name => this.updateName(name).catch(handleErrorForInput),
      updateLogin: login => this.updateLogin(login).catch(handleErrorForInput),
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
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  uploadAsset: PropTypes.func.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

const UserEditorContainer = ({api, children, initialUser}) => (
  <ErrorHandlers>
    {errorFuncs => (
      <Uploader>
        {uploadFuncs => (
          <CurrentUserProvider>
            {(currentUser, fetched, updateCurrentUser) => (
              <UserEditor {...{api, currentUser, updateCurrentUser, initialUser}} {...uploadFuncs} {...errorFuncs}>
                {children}
              </UserEditor>
            )}
          </CurrentUserProvider>
        )}
      </Uploader>
    )}
  </ErrorHandlers>
);
UserEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  initialUser: PropTypes.object.isRequired,
};

export default UserEditorContainer;