import React from 'react';
import PropTypes from 'prop-types';

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
  
  async updateFields(changes) {
    const {data} = await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(data);
  }
  
  render() {
    const funcs = {
    };
    return children(this.state, funcs, this.userIsMember());
  }
}

const ProjectPageEditor = ({project, updateFields, ...props}) => {
  function updateDomain(domain) {
    return updateFields({domain}).then(() => {
      history.replaceState(null, null, `/~${domain}`);
      document.title = `~${domain}`;
    }, ({response: {data: {message}}}) => Promise.reject(message));
  }
  const funcs = {
    updateDomain: domain => updateDomain(domain),
    updateDescription: description => updateFields({description}),
    updatePrivate: isPrivate => updateFields({private: isPrivate}),
  };
  return <ProjectPage project={project} {...funcs} {...props}/>;
};
ProjectEditor.propTypes = {
  api: PropTypes.any.isRequired,
  initialProject: PropTypes.object.isRequired,
};