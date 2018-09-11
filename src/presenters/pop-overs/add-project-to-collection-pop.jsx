import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import CollectionResultItem from '../includes/collection-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

{/* NOTE: Categories are just used to load dummy info - should get rid of in final implementaiton */}
import categories from '../../curated/categories.js';

const ProjectSearchResults = ({projects, action}) => (
  (projects.length > 0) ? (
    <ul className="results">
      {projects.map(project => (
        <li key={project.id}>
          <ProjectResultItem domain={project.domain} description={project.description} users={project.users} id={project.id} isActive={false} action={() => action(project)} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="results-empty">nothing found <span role="img" aria-label="">💫</span></p>
  )
);

ProjectSearchResults.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  action: PropTypes.func.isRequired,
};

class AddProjectToCollection extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
  }
  
  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
    });
  }
  
  onClick(project) {
    this.props.togglePopover();
    this.props.add(project);
    
    // add project to page
  }
  
  render() {
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
          {/* TO DO: Replace category with user's collections */}
          <section class="pop-over-actions results-list">
            <ul class="results">
              <li>
               <CollectionResultItem domain={categories[0].name} description={categories[0].description} id={categories[0].id} avatarUrl={categories[0].avatarUrl} url={categories[0].url} isActive={false} action={() => null} />
              </li>
            </ul>
          </section>
          <section className="pop-over-info">
            <input id="collection-name"  
              no-autofocus // eslint-disable-line jsx-a11y/no-autofocus
              value={this.state.query} onChange={this.handleChange}
              className="pop-over-input create-input"
              placeholder="New Collection Name"
            />
            {/* TO DO: Actually create a new collection here */}
            <button className="create-collection button-small">
              Create
            </button>
        </section>
      </dialog>
    );
  }
}

AddProjectToCollection.propTypes = {
  api: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  collectionProjects: PropTypes.any.isRequired,
  togglePopover: PropTypes.array.isRequired,
};

export default AddProjectToCollection;