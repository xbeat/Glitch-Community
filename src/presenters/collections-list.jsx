import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import CollectionItem from "./collection-item.jsx";
import {defaultAvatar, getLink,colors} from '../models/collection';
import {getPredicates, getCollectionPair} from '../models/words';
import Loader from './includes/loader.jsx';


import _ from 'lodash';


class CollectionsList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      deletedCollectionIds: [],
      collections: this.props.collections,
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.collections !== this.props.collections){
      this.setState({collections: nextProps.collections});
    } 
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
    const {title, api, isAuthorized, currentUser} = this.props;
    const collections = this.state.collections.filter(({id}) => !this.state.deletedCollectionIds.includes(id));
    return (
      ((currentUser.login || currentUser.login !== this.props.userLogin) && 
        <article className="collections">
          <h2>{title}</h2>

          {( isAuthorized 
            ? 
            ( collections.length > 0 
              ? <CreateCollectionButton api={api}/>   
              : <CreateFirstCollection api={api}/>
            )
            : null
          )}

          <CollectionsUL {...{collections, api, isAuthorized, deleteCollection: this.deleteCollection, userLogin: this.props.userLogin}}></CollectionsUL>

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
  userLogin: PropTypes.number.isRequired,
};

const CreateFirstCollection = ({api}) =>{
  return(
    <div className="create-first-collection">
      <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-empty.svg?1539800010738" alt=""/>
      <p className="placeholder">Create collections to organize your favorite projects.</p><br/>
      <CreateCollectionButton api={api}/>  
    </div>
  );
};

class CreateCollectionButton extends React.Component{
  constructor(props){
    super(props);
    this.state={
      done: false,
      error: false,
      loading: false,
      newCollectionUrl: "",
    };
  }
  async createCollection(api){
    this.setState({loading: true});

    try{
      let name = await getCollectionPair();
      let predicate = await getPredicates()[0];
      let collectionSynonym = name.split("-")[1];
      let description = `A ${collectionSynonym} of projects that does ${predicate} things`;
      let url = _.kebabCase(name);
      
      // defaults
      let avatarUrl = defaultAvatar;
      // get a random color
      let randomHex = Object.values(colors);
      let coverColor = randomHex[Math.floor(Math.random()*randomHex.length)];
      
      const {data} = await api.post('collections', {
        name,
        description,
        url,
        avatarUrl,
        coverColor,
      });
      let collectionUrl = data.url;

      let userName = "";
      api.get(`users/${data.userLogin}`).then(({data}) => {
        userName = data.login;
        let newCollectionUrl = getLink(userName, collectionUrl);
        this.setState({newCollectionUrl: newCollectionUrl});
        this.setState({done: true});
      });
    }catch(error){
      if(error && error.response && error.response.data && error.response.data.message){
        this.setState({error: error.response.data.message});
        // MAYBE HANDLE ERROR HERE - a notification?
      }
    }
  }
  
  render(){
    if(this.state.done){
      return <Redirect to={this.state.newCollectionUrl} push={true}/>;
    }else if(this.state.loading){
      return <Loader />;
    }
    return (
      <div id="create-collection-container">
        <button className="button" id="create-collection" onClick={() => this.createCollection(this.props.api)}>
            Create Collection
        </button>    
      </div>
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
};  

export const CollectionsUL = ({collections, deleteCollection, api, isAuthorized, userLogin}) => {
  // order by updatedAt date
  const orderedCollections = _.orderBy(collections, collection => collection.updatedAt).reverse();
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
  userLogin: PropTypes.number.isRequired,
};


export default CollectionsList;