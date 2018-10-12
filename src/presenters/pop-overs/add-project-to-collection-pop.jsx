import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import Project, {getAvatarUrl} from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import {DataLoader} from '../includes/loader.jsx';

import CollectionResultItem from '../includes/collection-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import Notifications from '../notifications.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';
import {getLink,colors} from '../../models/collection';

import _ from 'lodash';

class AddProjectToCollectionPop extends React.Component {
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
    const query = evt.currentTarget.value;
    this.setState({ query });
    console.log(`${this.state.query}`);
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
  
  // TO DO: ensure that the user doesn't already have a collection with this name
  validate(name){
    return true
  }
  
  async createNewCollection(api, collectionName, currentUser){
    let collection = {};
    // create a new collection here
    try{
      let name = collectionName;
      let description = `A collection of projects that does ${collectionName} things`;
      let url = _.kebabCase(name);
      let avatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"; // default fish
      let randomHex = Object.values(colors);
      let coverColor = randomHex[Math.floor(Math.random()*randomHex.length)];
      if(this.validate(name)){
        const {data} = await api.post('collections', {
          name,
          description,
          url,
          avatarUrl,
          coverColor,
        });
        collection = data;
      }
      
    }catch(error){
      this.setState({error: true});
    }
    return collection;
  }
  
  async addProjectToCollection(api, project, collection){
  }
  
  addProjectToNewCollection(project){
    // get text from input field
    const newCollectionName = this.state.query;
    console.log(`newCollectionName: ${newCollectionName}`);
    
    // create a new collection
    let newCollection = this.createNewCollection(this.props.api, newCollectionName, this.props.currentUser);
    
    // add the selected project to the collection
    this.addProjectToCollection(this.props.api, project, newCollection);
    
    // redirect to that collection
    this.setState({newCollectionUrl: `/@{this.props.currentUser.login}/{newCollection.url}`});
    this.setState({done: true});
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
        
        <section className="pop-over-actions results-list">
          <ul className="results">
            <DataLoader get={() => this.props.api.get(`collections/?userId=${this.props.currentUser.id}`)}>
              { ({data}) => 
                  data.map(collection =>   
                      // filter out collections that already contain the selected project
                      (collection.projects.length === collection.projects.filter(project => project.id !== this.props.project.id).length && 
                        <li>
                           <CollectionResultItem 
                             addProjectToCollection={this.props.addProjectToCollection}
                             api={this.props.api}
                             project={this.props.project}
                             collection={collection}                         
                             togglePopover={this.props.togglePopover} 
                             />
                         </li>
                         )
                     )
               }
            </DataLoader>
          </ul>
        </section>
        <section className="pop-over-info">
          <form onSubmit={this.handleSubmit}>
            <PureEditableField
              className="pop-over-input create-input"
              />
          </form>
          <input id="collection-name"  
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input create-input"
            placeholder="New Collection Name"
          />
          {/* TO DO: Actually create a new collection here */}
          <button className="create-collection button-small" onClick={this.addProjectToNewCollection}>
              Create
          </button>
          {/* TO DO: Auto-Kebab here */}
          <p class="url-preview">
            /@{this.props.currentUser.login}/{_.kebabCase(this.state.query)}
          </p>
          
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

export default AddProjectToCollectionPop;
