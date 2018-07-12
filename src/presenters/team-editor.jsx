import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';

class TeamPageEditor extends React.Component {
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
  
  async removeUser(id) {
    await this.props.removeItem('users', id, 'users', {id});
    if (id === this.props.currentUserModel.id()) {
      const model = this.props.currentUserModel;
      model.teams(model.teams().filter(({id}) => id() !== this.props.team.id));
    }
  }
  
  render() {
    const {
      team,
      currentUserModel,
      updateFields,
      addItem,
      removeItem,
      ...props
    } = this.props;
    const funcs = {
      currentUserIsOnTeam: team.users.some(({id}) => currentUserModel.id() === id),
      updateDescription: description => updateFields({description}),
      addUser: id => addItem('users', id, 'users', UserModel({id}).asProps()),
      removeUser: id => this.removeUser(id),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => updateFields({hasCoverImage: false}),
      addProject: id => addItem('projects', id, 'projects', ProjectModel({id}).asProps()),
      removeProject: id => removeItem('projects', id, 'projects', {id}),
      addPin: projectId => addItem('pinned-projects', projectId, 'teamPins', {projectId}),
      removePin: projectId => removeItem('pinned-projects', projectId, 'teamPins', {projectId}),
    };
    return <TeamPage team={team} {...this.state} {...funcs} {...props}/>;
  }
}
TeamPageEditor.propTypes = {
  currentUserModel: PropTypes.object.isRequired,
  initialTeam: PropTypes.object.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};