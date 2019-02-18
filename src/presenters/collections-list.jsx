import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {TrackClick} from './analytics';
import CollectionItem from "./collection-item.jsx";
import {postNewCollection} from '../models/collection';
import Loader from './includes/loader.jsx';

import {orderBy} from 'lodash';


class CollectionsList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      deletedCollectionIds: [],
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }
     
  async deleteCollection(id) {
    this.setState( 
      ({deletedCollectionIds}) => ({
        deletedCollectionIds: [...deletedCollectionIds, id]
      })
    );
    await this.props.api.delete(`/collections/${id}`);
  }
  
  render() {
    const {title, api, isAuthorized, maybeCurrentUser, maybeTeam} = this.props;
    const deleteCollection = this.deleteCollection;
    const collections = this.props.collections.filter(({id}) => !this.state.deletedCollectionIds.includes(id));
    const hasCollections = !!collections.length;
    const canMakeCollections = isAuthorized && !!maybeCurrentUser;
    
    if(!hasCollections && !canMakeCollections) {
      return null;
    }
    return (
      <article className="collections">
        <h2>{title}</h2>
        {canMakeCollections &&
          <>
            <CreateCollectionButton {...{api, currentUser: maybeCurrentUser, maybeTeam}}/>
            {!hasCollections && <CreateFirstCollection {...{api, currentUser: maybeCurrentUser}}/>}
          </>
        }
        <CollectionsUL {...{collections, api, isAuthorized, deleteCollection}}/>
      </article>
    );
  }
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeCurrentUser: PropTypes.object,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt=""/>
    <p className="placeholder">Create collections to organize your favorite projects.</p><br/>
  </div>
);

export class CreateCollectionButton extends React.Component{
  constructor(props){
    super(props);
    this.state={
      shouldRedirect: false,
      error: false,
      loading: false,
      newCollectionUrl: "",
    };
    this.createCollection = this.createCollection.bind(this);
  }

  async createCollection(){
    this.setState({loading: true});
    try{
      const newCollectionUrl = await postNewCollection(this.props.api, null, null, (this.props.maybeTeam ? null : this.props.currentUser), this.props.maybeTeam);
      if(newCollectionUrl){
        this.setState({newCollectionUrl, shouldRedirect: true});
      }
    } catch(error){
      // Try again.
    }
  }
  
  
  render(){
    if(this.state.shouldRedirect){
      return <Redirect to={this.state.newCollectionUrl} push={true}/>;
    }
    if(this.state.loading){
      return (
        <div id="create-collection-container">
          <Loader />
        </div>
      );
    }
    return (
      <div id="create-collection-container">
        <TrackClick name="Create Collection clicked">
          <button className="button" id="create-collection" onClick={() => this.createCollection()}>
            Create Collection
          </button>
        </TrackClick>
      </div>
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  maybeTeam: PropTypes.object,
};  

export const CollectionsUL = ({collections, deleteCollection, api, isAuthorized}) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, collection => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}
      
      { orderedCollections.map(collection => (
        <CollectionItem key={collection.id} {...{collection, api, isAuthorized, deleteCollection}}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};


export default CollectionsList;