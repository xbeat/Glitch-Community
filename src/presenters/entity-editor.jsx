import React from 'react';
import PropTypes from 'prop-types';

import {matches, reject} from 'lodash';

import * as assets from '../utils/assets';

export default class EntityEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.initial;
  }
  
  localAddItem(field, model) {
    this.setState(prev => ({[field]: [...prev[field], model]}));
  }
  
  localRemoveItem(field, model) {
    this.setState(prev => ({[field]: reject(prev[field], matches(model))}));
  }
  
  updateFields(changes) {
    return this.props.api.patch(`${this.props.type}/${this.state.id}`, changes).then(({data}) => {
      this.setState(data);
    });
  }
  
  addItem(remoteField, remoteId, localField, localModel) {
    return this.props.api.post(`${this.props.type}/${this.state.id}/${remoteField}/${remoteId}`).then(() => {
      this.localAddItem(localField, localModel);
    });
  }
  
  removeItem(remoteField, remoteId, localField, localModel) {
    return this.props.api.delete(`${this.props.type}/${this.state.id}/${remoteField}/${remoteId}`).then(() => {
      this.localRemoveItem(localField, localModel);
    });
  }
  
  render() {
    return this.props.children({
      entity: this.state,
      updateFields: this.updateFields.bind(this),
      addItem: this.addItem.bind(this),
      removeItem: this.removeItem.bind(this),
      localAddItem: this.localAddItem.bind(this),
      localRemoveItem: this.localRemoveItem.bind(this),
    });
  }
}

EntityEditor.propTypes = {
  api: PropTypes.any.isRequired,
  initial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

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
  
  async leaveProject(id) {
    await this.props.api.delete(`/projects/${id}/authorization`, {
      data: {
        targetUserId: this.state.id,
      },
    });
    this.setState(({projects}) => ({projects: reject(projects, matches({id}))}));
  }
  
  async deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    const {data} = await this.props.api.get(`projects/${id}?showDeleted=true`);
    this.props.localRemoveItem('projects', {id});
    this.setState(({deletedProjects}) => ({deletedProjects: deletedProjects.filter(p => p.id !== id)}));
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
    this.setState(({deletedProjects}) => ({deletedProjects: deletedProjects.filter(p => p.id !== id)}));
    this.props.localAddItem('projects', data);
  }
  
  render() {
    const {
      children,
      currentUserId,
      updateFields,
      addItem,
      removeItem,
    } = this.props;
    const funcs = {
      updateName: name => this.updateName(name),
      updateLogin: login => this.updateLogin(login),
      updateDescription: description => this.updateFields({description}),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => this.updateFields({hasCoverImage: false}),
      addPin: projectId => addItem('pinned-projects', projectId, 'pins', {projectId}),
      removePin: projectId => removeItem('pinned-projects', projectId, 'pins', {projectId}),
      leaveProject: id => this.leaveProject(id),
      deleteProject: id => this.deleteProject(id),
      undeleteProject: id => this.undeleteProject(id),
      setDeletedProjects: deletedProjects => this.setState({deletedProjects}),
    };
    return children(this.state, funcs, this.state.id === currentUserId);
  }
}
UserEditor.propTypes = {
  children: PropTypes.func.isRequired,
  currentUserId: PropTypes.number.isRequired,
  initialUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  userModel: PropTypes.object.isRequired,
};