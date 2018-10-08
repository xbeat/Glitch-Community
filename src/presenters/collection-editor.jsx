import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';

import {CurrentUserConsumer} from './current-user.jsx';
import ErrorHandlers from './error-handlers.jsx';
import Uploader from './includes/uploader.jsx';

class CollectionEditor extends React.Component {
  constructor(props) {
    super(props);
    let color = "#FFA3BB"; // default color
    
    this.state = {
      color: this.props.initialCollection.coverColor,
      avatar: this.props.initialCollection.avatarUrl,
      ...props.initialCollection
    };
    
    this.setColor = this.setColor.bind(this);
    this.setAvatar = this.setAvatar.bind(this); 
  }
  
  setAvatar(newAvatar){
    this.setState({
      avatar: newAvatar
    });
    console.log(`newAvatar: ${newAvatar}`);
  }
  
  async updateColor(newColor){
    this.setState({
      color: newColor
    });
    console.log(`newColor: ${newColor}`);
  }

  async updateFields(changes) {
    console.log('update collection fields');
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
  
  // TO DO: async function
  addProject(project) {
    // need to replace api request temporarily before returning updated project list
    // await this.props.api.post(`collections/${this.state.id}/projects/${project.id}`);
    console.log(`attempting to add project ${project.domain}`);
    this.setState(({projects}) => ({
      projects: [project, ...projects],
    }));
  }
  
  // TO DO: async function
  removeProject(id) {
    // await this.props.api.delete(`collections/${this.state.id}/projects/${id}`);
    console.log(`attempting to delete project with id ${id}`);
    this.setState(({projects}) => ({
      projects: projects.filter(p => p.id !== id),
    }));
  }


  render() {
    console.log('render in collection editor');
    const {handleError, handleErrorForInput} = this.props;
    const funcs = {
      addProject: project => this.addProject(project).catch(handleError),
      removeProject: id => this.removeProject(id).catch(handleError),
      updateName: name => this.updateFields({name}).catch(handleErrorForInput),
      updateDescription: description => this.updateFields({description}).catch(handleError),
      uploadAvatar: () => assets.requestFile(blob => this.uploadAvatar(blob).catch(handleError)),
      updateColor: color => this.updateColor(color).catch(handleError),
    };
    return this.props.children(this.state, funcs, this.state.color, this.setColor, this.state.avatar, this.setAvatar);
  }
}
CollectionEditor.propTypes = {
  api: PropTypes.any.isRequired,
  addProject: PropTypes.func,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  updateCurrentUser: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
  removeProject: PropTypes.func,
  uploadAsset: PropTypes.func.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

const CollectionEditorContainer = ({api, children, initialCollection}) => (
  <ErrorHandlers>
    {errorFuncs => (
      <Uploader>
        {uploadFuncs => (
          <CurrentUserConsumer>
            {(currentUser, fetched, {update}) => (
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