// add-project-to-collection-pop.jsx -> Add a project to a collection via a project item's menu
import React from 'react';
import PropTypes from 'prop-types';
import {NestedPopover} from './popover-nested';

import {TrackClick} from '../analytics';
import {getAvatarUrl} from '../../models/project';

import Loader from '../includes/loader.jsx';

import CollectionResultItem from '../includes/collection-result-item.jsx';

import CreateCollectionPop from './create-collection-pop.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';

import {orderBy} from 'lodash';

class AddProjectToCollectionPopContents extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', // value of filter input field
      working: false,
      filteredCollections: [], // collections filtered from search query
      maybeCollections: null, //null means still loading
    };
    this.updateFilter = this.updateFilter.bind(this);
  }
  
  updateFilter(query){
    console.log('query');
    let collections = this.state.maybeCollections;
    console.log("collections %O", collections);
    query = query.toLowerCase().trim();
    let filteredCollections = collections.filter(collection => collection.name.toLowerCase().includes(query)); 
    console.log("filteredCollections %O", filteredCollections);
  }
  
  async loadCollections() {
    const userCollections = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}`);
    
    // add current user as owner for collection (for generating user avatar for collection result item)
    userCollections.data.forEach(userCollection => {
      userCollection.owner = this.props.currentUser;
    });
    
    
    const userTeams = this.props.currentUser.teams;
    for(const team of userTeams){
      const {data} = await this.props.api.get(`collections/?teamId=${team.id}`);
      const teamCollections = data;
      if(teamCollections){
        teamCollections.forEach(teamCollection => {
          // get the team avatar
          teamCollection.owner = this.props.currentUser.teams.find(userTeam => userTeam.id == team.id);
          userCollections.data.push(teamCollection)
        });
      }
    }
    let orderedCollections = orderBy(userCollections.data, collection => collection.updatedAt).reverse();
    console.log(orderedCollections);
    
    // store all team owners
    
    this.setState({maybeCollections: orderedCollections, filteredCollections: orderedCollections });
  }
  
  async loadCollectionTeam(teamId) {
    const {data} = await this.props.api.get(`teams/${teamId}`);
    return data;
  }
  
  async componentDidMount() {
    this.loadCollections();
  }
  
  render() {
    const {maybeCollections, filteredCollections} = this.state;
    
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {( !this.props.fromProject ?
          <NestedPopoverTitle>
            <img src={getAvatarUrl(this.props.project.id)} alt={`Project avatar for ${this.props.project.domain}`}/> Add {this.props.project.domain} to collection
          </NestedPopoverTitle>
          : null
        )}
        
        {(maybeCollections && maybeCollections.length > 3) && (
          <section className="pop-over-info">
            <input id="collection-filter" 
              className="pop-over-input search-input pop-over-search" 
              onChange={(evt) => {this.updateFilter(evt.target.value);}}
              placeholder="Filter collections" />
          </section>
        )}
        
        {maybeCollections ? (
          filteredCollections.length ? (
            <section className="pop-over-actions results-list">
              <ul className="results">
                {filteredCollections.map((collection) =>   
                  // filter out collections that already contain the selected project
                  (collection.projects && collection.projects.every(project => project.id !== this.props.project.id) && 
                    <li key={collection.id}>
                      <TrackClick name="Project Added to Collection" context={{groupId: collection.team ? collection.team.id : 0}}>
                        <CollectionResultItem 
                          api={this.props.api}
                          onClick={this.props.addProjectToCollection}
                          project={this.props.project}
                          collection={collection}                         
                          togglePopover={this.props.togglePopover} 
                          currentUser={this.props.currentUser}
                        />
                      </TrackClick>
                    </li>
                  )
                )
                }
              </ul>
            </section>
          ) : (<section className="pop-over-info">
            <p className="info-description">
              Organize your favorite projects in one place
            </p>
          </section>)
        ) : <Loader/>}
        
        <section className="pop-over-actions">
          {/* TO DO: may want to consider if we force all users to go through Create Collection Pop or only users with teams */}
          <button className="create-new-collection button-small" onClick={this.props.createCollectionPopover} >Add to a new collection</button> 
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPopContents.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func, // required but added dynamically
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};


const AddProjectToCollectionPop = ({...props}) => {
  return(
    <NestedPopover alternateContent={() => <CreateCollectionPop {...props} api={props.api} togglePopover={props.togglePopover}/>} startAlternateVisible={false}>
      { createCollectionPopover => (
        <AddProjectToCollectionPopContents {...props} createCollectionPopover={createCollectionPopover}/>
      )}
    </NestedPopover>
  );
};

export default AddProjectToCollectionPop;
