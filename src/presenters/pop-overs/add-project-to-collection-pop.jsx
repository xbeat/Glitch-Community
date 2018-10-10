import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import Project, {getAvatarUrl} from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import CollectionResultItem from '../includes/collection-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import Notifications from '../notifications.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';

import {DataLoader} from './includes/loader.jsx';

{/* NOTE: Categories are just used to load dummy info - should get rid of in final implementation */}
import categories from '../../curated/categories.js';

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
  
  onClick(collection) {
    this.props.togglePopover();    
  }
  
  render() {
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {( !this.props.fromProject ?
          <NestedPopoverTitle>
            <img src={getAvatarUrl(this.props.project.id)}/> Add {this.props.project.domain} to collection
          </NestedPopoverTitle>
          : null
          )}
        
        {/* TO DO: Replace category with user's collections */}
        <section className="pop-over-actions results-list">
          <ul className="results">
            <DataLoader get={() => this.props.api.get(`collections/?userId=${this.props.currentUser.id}`)}>
              { ({data}) => 
                  { data.map(collection =>                      li>
                       CollectionResultItem 
                         rojectName={this.props.project.domain}
                         ollectionName={ccollection.name}                         escription={ccollectiondescription} 
                         d={ccollectionid.toString()} 
                         vatarUrl={ccollectionavatarUrl} 
                         rl={ccollectionurl} isActive={false} 
                         ogglePopover={this.props.togglePopover} 
                         >
                       /li>

                   )}              }
            </DataLoader>
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
  currentUser: PropTypes.object,
  togglePopover: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

export default AddProjectToCollection;
