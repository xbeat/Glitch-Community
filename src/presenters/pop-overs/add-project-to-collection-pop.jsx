// add-project-to-collection-pop.jsx -> Add a project to a collection via a project item's menu
import React from 'react';
import PropTypes from 'prop-types';
import {NestedPopover} from './popover-nested';

import {TrackClick} from '../analytics';
import {getAvatarUrl} from '../../models/project';

import Loader from '../includes/loader.jsx';

import CollectionResultItem from '../includes/collection-result-item.jsx';

import {CreateNewCollectionPop} from './create-new-collection-pop.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';

import _ from 'lodash';


class AddProjectToCollectionPopContents extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      working: false,
      maybeCollections: null, //null means still loading
    };
  }
  
  async loadCollections() {
    const collections = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}`);
    this.setState({maybeCollections: _.orderBy(collections.data, collection => collection.updatedAt).reverse()});
  }
  
  
  async componentDidMount() {
    this.loadCollections();
  }
  
  render() {
    const {maybeCollections} = this.state;
    
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
            <input id="collection-filter" className="pop-over-input search-input pop-over-search" placeholder="Filter collections"/>
          </section>
        )}
        
        {maybeCollections ? (
          maybeCollections.length ? (
            <section className="pop-over-actions results-list">
              <ul className="results">
                {maybeCollections.map(collection =>   
                  // filter out collections that already contain the selected project
                  (collection.projects.every(project => project.id !== this.props.project.id) && 
                    <li key={collection.id}>
                      <TrackClick name="Project Added to Collection" context={{groupId: collection.team ? collection.team.id : 0}}>
                        <CollectionResultItem 
                          onClick={this.props.addProjectToCollection}
                          currentUserLogin={this.props.currentUser.login}
                          project={this.props.project}
                          collection={collection}                         
                          togglePopover={this.props.togglePopover} 
                          api={this.props.api}
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
          <button className="create-new-collection button-small" onClick={this.props.createNewCollectionPopover} >Add to a new collection</button>       
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
    <NestedPopover alternateContent={() => <CreateNewCollectionPop {...props} api={props.api} togglePopover={props.togglePopover}/>}>
      { createNewCollectionPopover => (
        <AddProjectToCollectionPopContents {...props} createNewCollectionPopover={createNewCollectionPopover}/>
      )}
    </NestedPopover>
    )
}

export default AddProjectToCollectionPop;
