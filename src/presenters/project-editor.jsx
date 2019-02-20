import React from "react";
import PropTypes from "prop-types";

<<<<<<< HEAD
import { CurrentUserConsumer } from "./current-user.jsx";
import ErrorHandlers from "./error-handlers.jsx";
=======
import { CurrentUserConsumer } from './current-user';
import ErrorHandlers from './error-handlers';
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656

class ProjectEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialProject,
    };
  }

  userIsMember() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;
    return this.state.users.some(({ id }) => currentUserId === id);
  }

  async updateFields(changes) {
    await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(changes);
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(
<<<<<<< HEAD
      `collections/${collection.id}/add/${project.id}`
=======
      `collections/${collection.id}/add/${project.id}`,
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    );
  }

  render() {
<<<<<<< HEAD
    const { handleError, handleErrorForInput, handleCustomError } = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) =>
        this.addProjectToCollection(project, collection).catch(
          handleCustomError
        ),
      updateDomain: domain =>
        this.updateFields({ domain }).catch(handleErrorForInput),
      updateDescription: description =>
        this.updateFields({ description }).catch(handleError),
      updatePrivate: isPrivate =>
        this.updateFields({ private: isPrivate }).catch(handleError)
=======
    const { handleError, handleErrorForInput } = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleError),
      updateDomain: domain => this.updateFields({ domain }).catch(handleErrorForInput),
      updateDescription: description => this.updateFields({ description }).catch(handleError),
      updatePrivate: isPrivate => this.updateFields({ private: isPrivate }).catch(handleError),
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    };
    return this.props.children(this.state, funcs, this.userIsMember());
  }
}

ProjectEditor.propTypes = {
  api: PropTypes.any,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialProject: PropTypes.object.isRequired
};

<<<<<<< HEAD
=======
ProjectEditor.defaultProps = {
  currentUser: null,
  api: null,
};

>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
const ProjectEditorContainer = ({ api, children, initialProject }) => (
  <ErrorHandlers>
    {wrapErrors => (
      <CurrentUserConsumer>
        {currentUser => (
          <ProjectEditor
            api={api}
            currentUser={currentUser}
            initialProject={initialProject}
            {...wrapErrors}
          >
            {children}
          </ProjectEditor>
        )}
      </CurrentUserConsumer>
    )}
  </ErrorHandlers>
);
ProjectEditorContainer.propTypes = {
  api: PropTypes.any,
  children: PropTypes.func.isRequired,
  initialProject: PropTypes.object.isRequired
};
ProjectEditorContainer.defaultProps = {
  api: null,
};

export default ProjectEditorContainer;
