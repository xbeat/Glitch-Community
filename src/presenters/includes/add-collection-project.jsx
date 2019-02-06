import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';

class AddCollectionProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projects: []};
  }
  async loadProjects() {
    this.setState({projects: []});
    if (this.props.collection.teamId > 0) {
    } else if (this.props.collection.userId
  }
  componentDidMount() {
    this.loadProjects();
  }
  componentDidUpdate(prevProps) {
    const collection = this.props.collection;
    const prevCollection = prevProps.collection;
    if (collection.teamId !== prevCollection.teamId || collection.userId !== prevCollection.userId) {
      this.loadProjects();
    }
  }
  render() {
    return (
      <PopoverWithButton buttonClass="button add-project opens-pop-over" buttonText="Add Project" passToggleToPop>
        <AddCollectionProjectPop initialProjects={this.state.projects} {...this.props} />
      </PopoverWithButton>
    );
  }
}

AddCollectionProject.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired
};

export default AddCollectionProject;
