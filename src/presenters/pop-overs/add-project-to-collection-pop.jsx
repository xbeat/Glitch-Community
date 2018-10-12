import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
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
import {PureEditableField} from '../includes/editable-field.jsx';

import _ from 'lodash';

class AddProjectToCollectionPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      done: false,
      error: false,
      query: '', //The actual search text
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(newValue) {
    this.setState({ query: newValue });
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

  
  handleSubmit(){
    console.log('add project to new collection');
    // get text from input field
    const newCollectionName = this.state.query;
    
    // create a new collection
    let newCollection = {};
    // create a new collection here
    try{
      let name = newCollectionName;
      let description = `A collection of projects that does wondrous things`; // change default later
      let url = _.kebabCase(newCollectionName);
      let avatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"; // default fish
      let randomHex = Object.values(colors);
      let coverColor = randomHex[Math.floor(Math.random()*randomHex.length)];
      if(this.validate(newCollectionName)){
        this.props.api.post('collections', {
          name,
          description,
          url,
          avatarUrl,
          coverColor,
        }).then( 
          data => {
            newCollection = data;
            console.log("created collection %O", newCollection); 
            
            try{
              // add the selected project to the collection
              this.props.api.patch(`collections/${newCollection.id}/add/${this.props.project.id}`)
              .then(() => {
                console.log('added project to collection');  
                          
                // redirect to that collection
                let newCollectionUrl = `/@{this.props.currentUser.login}/{newCollection.url}`;
                console.log(`newCollectionUrl: ${newCollectionUrl}`);
                this.setState({newCollectionUrl:  newCollectionUrl});
                this.setState({done: true});
              });
              
            }catch(error){
              this.setState({error: true});
            }
          }
        );
      }
    }catch(error){
      this.setState({error: true});
    }
  }
  
  render() {
    const placeholder = 'New Collection Name';
    if(this.state.done){
      return <Redirect to={this.state.newCollectionUrl}/>
    }
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
              id="collection-name"
              className="pop-over-input create-input"
              value={this.state.query} 
              update={this.handleChange}
              placeholder={placeholder}
            />
            <button type="submit" className="create-collection button-small">
                Create
            </button>   
            <p className="url-preview">
              {/* Handle anonymous users here? */}
              /@{this.props.currentUser.login}/{_.kebabCase(this.state.query || placeholder)}
            </p>         
          </form>         
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
