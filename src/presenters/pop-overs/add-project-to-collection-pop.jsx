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
      filteredCollections: this.props.maybeCollections, // collections filtered from search query
    };
    this.updateFilter = this.updateFilter.bind(this);
  }
  
  updateFilter(query){
    let collections = this.state.maybeCollections;
    query = query.toLowerCase().trim();
    let filteredCollections = collections.filter(collection => collection.name.toLowerCase().includes(query)); 
    this.setState({filteredCollections: filteredCollections});
  }
  
  render() {
    const {filteredCollections} = this.state;
    
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {( !this.props.fromProject ?
          <NestedPopoverTitle>
            <img src={getAvatarUrl(this.props.project.id)} alt={`Project avatar for ${this.props.project.domain}`}/> Add {this.props.project.domain} to collection
          </NestedPopoverTitle>
          : null
        )}
        
        {(this.props.filteredCollections && this.props.filteredCollections.length > 3) && (
          <section className="pop-over-info">
            <input id="collection-filter" 
              className="pop-over-input search-input pop-over-search" 
              onChange={(evt) => {this.updateFilter(evt.target.value);}}
              placeholder="Filter collections" />
          </section>
        )}
        
        (filteredCollections.length ? (
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
              {this.props.query ? <NoSearchResultsPlaceholder/> :<NoCollectionPlaceholder/>}
          </section>)
        )
        
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

const NoSearchResultsPlaceholder = () => <p className="info-description">Nothing found <span role="img" aria-label="">💫</span></p>;
const NoCollectionPlaceholder = () => <p className="info-description">Create collections to organize your favorite projects.</p>;

class AddProjectToCollectionPop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      maybeCollections: null, // null means still loading
    }
  }
  
  async loadCollections() {
    // first, load all of the user's collections
    const userCollections = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}`);
    // add current user as owner for collection (for generating user avatar for collection result item)
    userCollections.data.forEach(userCollection => {
      userCollection.owner = this.props.currentUser;
    });
    
    // next all of the user's team's collections
    const userTeams = this.props.currentUser.teams;
    for(const team of userTeams){
      const {data} = await this.props.api.get(`collections/?teamId=${team.id}`);
      const teamCollections = data;
      if(teamCollections){
        teamCollections.forEach(teamCollection => {
          teamCollection.owner = this.props.currentUser.teams.find(userTeam => userTeam.id == team.id);
          userCollections.data.push(teamCollection);
        });
      }
    }
    
    // order reverse chronological
    let orderedCollections = orderBy(userCollections.data, collection => collection.updatedAt).reverse();
    
    this.setState({maybeCollections: orderedCollections});
  }
  
  async componentDidMount() {
    this.loadCollections();
  }
  
  render(){
    return(
      <NestedPopover alternateContent={() => <CreateCollectionPop {...this.props} api={this.props.api} collections={this.state.maybeCollections} togglePopover={this.props.togglePopover}/>} startAlternateVisible={false}>
        { createCollectionPopover => (
          <>
            { this.state.maybeCollections ? 
              <AddProjectToCollectionPopContents {...this.props} collections={this.state.maybeCollections} createCollectionPopover={createCollectionPopover}/>
             : <Loader/>
            }
          </>
        )}
      </NestedPopover>
    );
  }
};

AddProjectToCollectionPop.propTypes = {
    
}

export default AddProjectToCollectionPop;
