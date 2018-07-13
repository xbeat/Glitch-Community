import React from 'react';
import PropTypes from 'prop-types';

import ErrorHandlers from './error-handlers.jsx';

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
  
  async updateFields(changes) {
    await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(changes);
  }
  
  render() {
    const inputFuncs = this.props.addHandleErrorForInput({
      updateDomain: domain => this.updateFields({domain}),
    });
    const funcs = this.props.addHandleError({
      updateDomain: domain => this.updateFields({domain}),
      updateDescription: description => this.updateFields({description}),
      updatePrivate: isPrivate => this.updateFields({private: isPrivate}),
    });
    return this.props.children(this.state, {...inputFuncs, ...funcs}, this.userIsMember());
  }
}
ProjectEditor.propTypes = {
  addHandleError: PropTypes.func.isRequired,
  addHandleErrorForInput: PropTypes.func.isRequired,
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialProject: PropTypes.object.isRequired,
};

const ProjectEditorContainer = ({api, children, currentUserModel, initialProject}) => (
  <ErrorHandlers>
    {wrapErrors => (
      <ProjectEditor api={api} currentUserModel={currentUserModel} initialProject={initialProject} {...wrapErrors}>
        {children}
      </ProjectEditor>
    )}
  </ErrorHandlers>
);
ProjectEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialProject: PropTypes.object.isRequired,
};

export default ProjectEditorContainer;