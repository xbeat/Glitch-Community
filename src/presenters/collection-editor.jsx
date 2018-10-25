import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';

import {CurrentUserConsumer} from './current-user.jsx';
import ErrorHandlers from './error-handlers.jsx';
import Uploader from './includes/uploader.jsx';

class CollectionEditor extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ...props.initialCollection
    };
    
    this.updateColor = this.updateColor.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this); 
  }
  
  userIsAuthor(){
    if (!this.props.currentUser) return false;
    if (!this.state.user) return false;
    const currentUserId = this.props.currentUser.id;
    return this.state.user.id === currentUserId;
  }
  
  updateColor(coverColor){
    this.setState({
      color: coverColor
    });
    this.updateFields({coverColor});
  }
  
  updateAvatar(avatarUrl){
    this.setState({
      avatar: avatarUrl
    });
    this.updateFields({avatarUrl});
  }

  async updateFields(changes) {
    // console.log('update collection fields');
    const {data} = await this.props.api.patch(`collections/${this.state.id}`, changes);
    this.setState(data);
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
  }
  
  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
    if(collection.id == this.state.id){
      // add project to collection page
      this.setState(({projects}) => ({
        projects: [...projects, project],
      }));
    }
  }
  
  async removeProjectFromCollection(project) {
    await this.props.api.patch(`collections/${this.state.id}/remove/${project.id}`);
    this.setState(({projects}) => ({
      projects: projects.filter(p => p.id !== project.id),
    }));
  }
  
  async deleteCollection(){
    await this.props.api.delete(`/collections/${this.state.id}`);
  }

  render() {
    const {handleError, handleErrorForInput} = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleError),
      removeProjectFromCollection: project => this.removeProjectFromCollection(project).catch(handleError),
      deleteCollection: () => this.deleteCollection().catch(handleError),
      updateNameAndUrl: ({name, url}) => this.updateFields({name, url}).catch(handleErrorForInput),
      updateDescription: description => this.updateFields({description}).catch(handleError),
      updateAvatar: avatarUrl => this.updateAvatar(avatarUrl),
      updateColor: color => this.updateColor(color),
    };
    return this.props.children(this.state, funcs, this.userIsAuthor());
  }
}
CollectionEditor.propTypes = {
  api: PropTypes.any.isRequired,
  addProjectToCollection: PropTypes.func,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  updateCurrentUser: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
  removeProjectFromCollection: PropTypes.func,
  uploadAsset: PropTypes.func.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

const CollectionEditorContainer = ({api, children, initialCollection}) => (
  <ErrorHandlers>
    {errorFuncs => (
      <Uploader>
        {uploadFuncs => (
          <CurrentUserConsumer>
            {(currentUser) => (
              <CollectionEditor {...{api, currentUser, initialCollection}} {...uploadFuncs} {...errorFuncs}>
                {children}
              </CollectionEditor>
            )}
          </CurrentUserConsumer>
        )}
      </Uploader>
    )}
  </ErrorHandlers>
);
CollectionEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
};

export default CollectionEditorContainer;