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
    const {api, collection, currentUser} = this.props;
    if (collection.teamId > 0) {
      const {data: team} = await api.get(`teams/${collection.teamId}`);
      this.setState({projects: team.projects});
    } else if (collection.userId === currentUser.id) {
      this.setState({projects: currentUser.projects});
    } else if (collection.userId > 0) {
      const {data: user} = await api.get(`users/${collection.userId}`);
      this.setState({projects: user.projects});
    }
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
        <AddCollectionProjectPop initialProjects={this.state.projects.slice(0,20)} {...this.props} />
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
