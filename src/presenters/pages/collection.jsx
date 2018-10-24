import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from "react-svg-inline";
import {Redirect} from 'react-router-dom';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import {getLink, defaultAvatarSVG} from '../../models/collection';

import {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import NotFound from '../includes/not-found.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import CollectionEditor from '../collection-editor.jsx';

import AddCollectionProject from '../includes/add-collection-project.jsx';
import AddCollectionAvatar from '../includes/add-collection-avatar.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';
import EditCollectionNameAndUrl from '../includes/edit-collection-name-and-url.jsx';

import {hexToRgbA, getContrastTextColor} from '../../models/collection.js'; 

import {UserTile} from '../users-list.jsx';

import {CurrentUserConsumer} from '../current-user.jsx';

function syncPageToUrl(owner, url) {
  history.replaceState(null, null, getLink(owner, url));
}

class DeleteCollectionBtn extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      done: false,
    };
  } 
  render(){
    if(this.state.done){
      return <Redirect to={`/@${this.props.currentUserLogin}`} />;
    }
    return (
      <button className={`button delete-collection button-tertiary`} 
        onClick={() => 
        { 
          console.log('clicked delete collection');
          if(!window.confirm(`Are you sure you want to delete your collection?`)){
            return;
          }
          console.log('delete collection');
          this.props.deleteCollection();
          this.setState({done: true});
        }} >
        Delete Collection
      </button>
    );
    
  }
}

DeleteCollectionBtn.propTypes = {
  deleteCollection: PropTypes.func.isRequired,
  currentUserLogin:PropTypes.string.isRequired,
};

class Avatar extends React.Component{
  constructor(props){
    super(props);
    this.state={
      backgroundColor: this.props.backgroundColor
    };
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.backgroundColor){
      this.setState({ backgroundColor: nextProps.backgroundColor});
      let svgBackgroundEl = document.querySelector('svg .background');
      svgBackgroundEl.setAttribute('fill', nextProps.backgroundColor);
    } 
  }
  
  componentDidMount(){
    let svgBackgroundEl = document.querySelector('svg .background');
    svgBackgroundEl.setAttribute('fill', this.state.backgroundColor);
  }
  
  render(){
    return(
      <SVGInline svg={defaultAvatarSVG}/>
    );
  }
}

const CollectionPageContents = ({
  api, 
  collection, 
  currentUser,
  deleteCollection,
  isAuthorized,
  updateNameAndUrl,
  updateDescription, 
  projectOptions, 
  uploadAvatar, 
  addProjectToCollection, 
  removeProjectFromCollection,
  updateColor,
  updateAvatar,
  userLogin,
  ...props}) => (
  
  <React.Fragment>  
    <Helmet>
      <title>{collection.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: hexToRgbA(collection.coverColor)}}>
        <header className="collection">
          <UserTile {...collection.user}/>
          <EditCollectionNameAndUrl isAuthorized={isAuthorized}
            owner={collection.user.login} name={collection.name} url={collection.url}
            update={data => updateNameAndUrl(data).then(() => syncPageToUrl(collection.user.login, data.url))}
          />
          <div className="collection-image-container">
            <Avatar backgroundColor={collection.coverColor}/>
          </div>
          
          {/* TO DO: actually enable uploading avatar - see example of uploadAvatar in user-editor.jsx */}
          {/*
          {(isAuthorized 
            ? <div className="upload-image-buttons">
              
              
              <AddCollectionAvatar
                api={api}
                collectionID = {collection.id}
                update={updateAvatar}
              />
              
              
                <button className="button button-small button-tertiary" onClick={uploadAvatar}>
                  <span>Replace Avatar</span>  
                </button>
              
            </div>
            : null
          )}
          */}
          
          <div className="collection-description">
            <AuthDescription
              authorized={isAuthorized} description={collection.description}
              update={updateDescription} placeholder="Tell us about your collection"
            />
          </div>
          
          {(isAuthorized && <EditCollectionColor
            update={updateColor}
            initialColor={collection.coverColor}
          />
          )}
          
          {(isAuthorized
            ? <DeleteCollectionBtn deleteCollection={deleteCollection} currentUserLogin={userLogin}/>
            : null
          )}
          
        </header>
        
        {collection &&
           <ProjectsLoader api={api} projects={collection.projects}>
             {projects => 
               <React.Fragment>
                 <div className="collection-contents">
                   <div className="collection-project-container-header">
                     <h3>Projects ({collection.projects.length})</h3>
                
                     {(isAuthorized 
                       ? <AddCollectionProject
                         addProjectToCollection={addProjectToCollection}
                         collection={collection}
                         api={api}
                         currentUserIsOwner={isAuthorized}
                         currentUser={currentUser}
                       />
                       : null
                     )}
                
                   </div>
          
                   {(collection.projects.length > 0 ?
                     (isAuthorized
                       ? <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} api={api} collectionColor={collection.coverColor}
                         projectOptions={{
                           removeProjectFromCollection,
                           addProjectToCollection,
                         }} 
                         {...props}/>

                       : 
                       (currentUser && currentUser.login 
                         ? <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} api={api} collectionColor={collection.coverColor} 
                           projectOptions={{
                             addProjectToCollection
                           }} 
                           {...props}/>
                         :
                         <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} api={api} collectionColor={collection.coverColor} 
                           projectOptions={{}} 
                           {...props}/>
                       )
                     )
                     :
                     (isAuthorized
                       ?
                       <div className="empty-collection-hint" style={{backgroundColor: collection.coverColor, color: getContrastTextColor(collection.coverColor)}}>
                          Click <b>Add Project</b> to search for projects to add to your collection.<br/><br/>You can add any project, created by any user.
                       </div>
                       :  <div className="empty-collection-hint" style={{backgroundColor: "rgba(255,255,255,0.8)", color: getContrastTextColor(collection.coverColor)}}>
                          No projects to see in this collection just yet.
                       </div>
                     )
                   )}
                 </div>
          
               </React.Fragment>
             }
           </ProjectsLoader>
        }
        
      </article>
      
    </main>
  </React.Fragment>
);

CollectionPageContents.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  children: PropTypes.node,
  currentUser: PropTypes.object,
  deleteCollection: PropTypes.func.isRequired,
  isAuthorized: PropTypes.any.isRequired,  
  projectOptions: PropTypes.object,
  removeProjectFromCollection: PropTypes.func,
  uploadAvatar: PropTypes.func,
};

async function getUserIdByLogin(api, userLogin){
  const {data} = await api.get(`userid/byLogin/${userLogin}`);
  if(data === "NOT FOUND"){
    return null;
  }
  return data;
}

async function getCollectionId(api, userId, collectionName){
  let collectionMatch = null;
  // parse through user's collections to find collection that matches the name of the collection
  const {data} = await api.get(`collections?userId=${userId}`);
  
  data.forEach(function loop(el, i){
    if(loop.stop){return;}
    if(el.url === collectionName){
      collectionMatch = data[i];
      loop.stop = true;
    }
  });
  if(!collectionMatch){
    return null;
  }
  return collectionMatch.id; 
  
}

async function getCollection(api, collectionId){
  const {data} = await api.get(`collections/${collectionId}`);
  return data;
}

async function loadCollection(api, userLogin, collectionName){
  
  // get userId by login name
  const userId = await getUserIdByLogin(api,userLogin);
  
  // get collection id
  const collectionId = await getCollectionId(api, userId, collectionName);
  
  // get collection
  const collection = await getCollection(api, collectionId);
  
  return collection;
}  

const CollectionPage = ({api, userLogin, name, ...props}) => (
  <Layout api={api}>
    <DataLoader get={() => loadCollection(api, userLogin, name)}
      renderError={() => <NotFound name={name}/>}
    >
      {collection => (
        <CurrentUserConsumer>
          {(currentUser) => (
            <CollectionEditor api={api} initialCollection={collection} >
              {(collection, funcs, userIsAuthor) =>(
                <CollectionPageContents collection={collection} userLogin={userLogin} api={api} currentUser={currentUser} isAuthorized={userIsAuthor} {...funcs} {...props}/>
              )}
            </CollectionEditor>
          )}
        </CurrentUserConsumer>
      )}
    </DataLoader>
  </Layout>
);

export default CollectionPage;