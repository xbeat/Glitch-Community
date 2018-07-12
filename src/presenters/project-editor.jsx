import React from 'react';
import PropTypes from 'prop-types';

import Notifications from './notifications.jsx';

class ProjectEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialProject
    };
  }
  
  userIsMember() {
    const currentUserId = this.props.currentUserModel.id();
    return this.state.users.some(({id}) => currentUserId === id);
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
  
  async updateFields(changes) {
    await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(changes);
  }
  
  render() {
    const handleError = this.handleError.bind(this);
    const handleErrorForInput = this.handleErrorForInput.bind(this);
    const funcs = {
      updateDomain: domain => this.updateFields({domain}).catch(handleErrorForInput),
      updateDescription: description => this.updateFields({description}).catch(handleError),
      updatePrivate: isPrivate => this.updateFields({private: isPrivate}).catch(handleError),
    };
    return this.props.children(this.state, funcs, this.userIsMember());
  }
}
ProjectEditor.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialProject: PropTypes.object.isRequired,
};

const ProjectEditorContainer = ({api, children, currentUserModel, initialProject}) => (
  <Notifications>
    {notifyFuncs => (
      <ProjectEditor api={api} currentUserModel={currentUserModel} initialProject={initialProject} {...notifyFuncs}>
        {children}
      </ProjectEditor>
    )}
  </Notifications>
);
ProjectEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialProject: PropTypes.object.isRequired,
};

export default ProjectEditorContainer;