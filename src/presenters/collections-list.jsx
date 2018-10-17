import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import CollectionItem from "./collection-item.jsx";
import {getLink,colors} from '../models/collection';

import axios from 'axios';
import _ from 'lodash';

const wordsApi = axios.create({
  baseURL: 'https://friendly-words.glitch.me/',
});

export const CollectionsList = ({title, collections, placeholder, deleteCollection, api, isAuthorized}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !collections.length) && (
      <div className="placeholder">{placeholder}</div>
    )}
    
    {( isAuthorized 
      ? 
        ( collections.length > 0 
           ? <CreateCollectionButton api={api}/>   
           : <CreateFirstCollection api={api}/>
        )
      : null
    )}

    <CollectionsUL {...{collections, deleteCollection, api, isAuthorized}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

// TO DO: ensure that the user doesn't already have a collection with this name
async function validate(name){
  return true
}

const CreateFirstCollection = ({api}) =>{
  return(
    <div className="create-first-collection">
      <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-empty.svg?1539800010738"/>
      <p className="placeholder">Create collections to organize your favorite projects.</p><br/>
      <CreateCollectionButton api={api}/>  
    </div>
    );
}

class CreateCollectionButton extends React.Component{
  constructor(props){
    super(props);
    this.state={
      done: false,
      error: false,
      newCollectionUrl: "",
    }
  }
  async createCollection(api){
    try{
      const {data} = await wordsApi.get('word-pairs');
      let name = data[0];
      let description = `A collection of projects that does ${name.split("-")[0]} things`;
      let url = _.kebabCase(name);
      
      // defaults
      let avatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"; // default fish
      // get a random color
      let randomHex = Object.values(colors);
      let coverColor = randomHex[Math.floor(Math.random()*randomHex.length)];
      console.log(`coverColor: ${coverColor}`);
      
      if(validate(name)){
        const {data} = await api.post('collections', {
          name,
          description,
          url,
          avatarUrl,
          coverColor,
        });
        let collectionUrl = data.url;
        console.log(`collectionUrl: ${collectionUrl}`);
       
        let userName = "";
        api.get(`users/${data.userId}`).then(({data}) => {
          console.log(data);
          userName = data.login;
          console.log(`userName: ${userName}`);
          let newCollectionUrl = getLink(userName, collectionUrl);
          console.log(`newCollectionUrl: ${newCollectionUrl}`);
          this.setState({newCollectionUrl: newCollectionUrl});
          this.setState({done: true});
        });
      } 
    }catch(error){
      this.setState({error: true});
    }
  }
  
  render(){
    if(this.state.done){
      return <Redirect to={this.state.newCollectionUrl}/>
    }
    return (
      <button className={`button create-collection`} onClick={() => this.createCollection(this.props.api)}>
          Create Collection
      </button>    
    )
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
}  

export const CollectionsUL = ({collections, deleteCollection, categoryColor, api, isAuthorized}) => {
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}
      
      { collections.map(collection => (
        <CollectionItem key={collection.id} collection={collection} api={api} isAuthorized={isAuthorized} deleteCollection={deleteCollection}></CollectionItem>
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