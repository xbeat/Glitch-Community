import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import CollectionItem from "./collection-item.jsx";
import {defaultAvatar, getLink,colors} from '../models/collection';
import {getCollections, getPredicate} from '../models/words';
import Loader from './includes/loader.jsx';

import {kebabCase, orderBy} from 'lodash';


class CollectionsList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      deletedCollectionIds: [],
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }
     
  async deleteCollection(id) {
    await this.props.api.delete(`/collections/${id}`);
    
    this.setState( 
      ({deletedCollectionIds}) => ({
        deletedCollectionIds: [...deletedCollectionIds, id]
      })
    );
  }
  
  render() {
    const {title, api, isAuthorized, currentUser, userLogin} = this.props;
    const collections = this.props.collections.filter(({id}) => !this.state.deletedCollectionIds.includes(id));
    return (       
      ((currentUser.login || currentUser.login !== userLogin) && collections.length > 0 && 
        <article className="collections">
          <h2>{title}</h2>

         { isAuthorized && <CreateCollectionButton {...{api, currentUser}}/> }

          <CollectionsUL {...{collections, api, isAuthorized, deleteCollection: this.deleteCollection, userLogin: this.props.userLogin}}></CollectionsUL>

        </article>
      )
      
      (( isAuthorized && collections.length == 0) &&
       <article className="collections">
          <h2>{title}</h2>
             <CreateFirstCollection {...{api}} />
       </article>
       )
    );  
  }
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userLogin: PropTypes.string.isRequired,
};

const CreateFirstCollection = ({api, currentUser}) =>{
  return(
    <div className="create-first-collection">
      <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-empty.svg?1539800010738" alt=""/>
      <p className="placeholder">Create collections to organize your favorite projects.</p><br/>
      <CreateCollectionButton {...{api, currentUser}}/>  
    </div>
  );
};

class CreateCollectionButton extends React.Component{
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
  
  async postCollection(api, collectionSynonym, predicate, userLogin){
    const name = [predicate, collectionSynonym].join('-');
    const description = `A ${collectionSynonym} of projects that does ${predicate} things`;
    const url = kebabCase(name);
    
    // defaults
    const avatarUrl = defaultAvatar;
    
    // get a random color
    const collectionColors = Object.values(colors);
    const coverColor = collectionColors[Math.floor(Math.random()*collectionColors.length)];    

    const {data} = await api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
      coverColor,
    });
    
    if(data && data.url){
      let newCollectionUrl = getLink(userLogin, data.url);
      this.setState({newCollectionUrl: newCollectionUrl});
      this.setState({shouldRedirect: true});
      return true;
    }
    return false;
  }
  
  async generateNames(userLogin) {
    let collectionSynonyms = ["mix","bricolage","playlist","assortment","potpourri","melange","album","collection","variety","compilation"];
    let predicate = userLogin;

    try {
      // get collection names
      collectionSynonyms = await getCollections();
      predicate = await getPredicate();
    } catch(error) {
      // If there's a failure, we'll stick with our defaults.
    }
    
    return [collectionSynonyms, predicate];
  }
  
  async createCollection(api, userLogin){
    this.setState({loading: true});
    
    const [collectionSynonymns, predicate] = await this.generateNames(userLogin);
    let creationSuccess = false;
    for(let synonym of collectionSynonymns){
      try{
        creationSuccess = await this.postCollection(api, synonym, predicate, userLogin);
        if(creationSuccess) {
          break;
        }
      } catch(error){
        // Try again.
      }
    }
    if(!creationSuccess) {
      this.setState({error: "Unable to create collection :-("});
    }
  }
  
  render(){
    if(this.state.shouldRedirect){
      return <Redirect to={this.state.newCollectionUrl} push={true}/>;
    }
    if(this.state.loading){
      return <Loader />;
    }
    return (
      <div id="create-collection-container">
        <button className="button" id="create-collection" onClick={() => this.createCollection(this.props.api, this.props.currentUser.login)}>
            Create Collection
        </button>    
      </div>
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
};  

export const CollectionsUL = ({collections, deleteCollection, api, isAuthorized, userLogin}) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, collection => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}
      
      { orderedCollections.map(collection => (
        <CollectionItem key={collection.id} {...{collection, api, isAuthorized, deleteCollection, userLogin}}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
  userLogin: PropTypes.string.isRequired,
};


export default CollectionsList;