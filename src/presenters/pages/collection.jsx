import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';
import NotFound from '../includes/not-found.jsx';

import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import CollectionEditor from '../collection-editor.jsx';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import AddCollectionProject from '../includes/add-collection-project.jsx';
import AddCollectionAvatar from '../includes/add-collection-avatar.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';

import {hexToRgbA} from '../../models/collection.js'; 

import {UserTile} from '../users-list.jsx';

import {CurrentUserConsumer} from '../current-user.jsx';

import _ from 'lodash';

const CollectionPageContents = ({
  api, 
  collection, 
  currentUser,
  deleteCollection,
  isAuthorized, 
  updateName, 
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
          <h1 className="collection-name">            
            {(isAuthorized 
              ? <AuthDescription authorized={isAuthorized}
                description={collection.name} 
                update={updateName} 
                placeholder="Name your collection"/> 
              : <React.Fragment>{collection.name} </React.Fragment>
            )}
            
          </h1>
          <div className="collection-image-container">
            <img src={collection.avatarUrl} alt=""/>
          </div>
          {/* TO DO: actually enable uploading avatar - see example of uploadAvatar in user-editor.jsx */}
          {(isAuthorized 
            ? <div className="upload-image-buttons">
              
              <AddCollectionAvatar
                api={api}
                collectionID = {collection.id}
                update={updateAvatar}
              />
              
              {/*
                <button className="button button-small button-tertiary" onClick={uploadAvatar}>
                  <span>Replace Avatar</span>  
                </button>
              */}
              
            </div>
            : null
          )}
          
          <p className="description">
            {(isAuthorized
              ? <AuthDescription
                authorized={isAuthorized} description={collection.description}
                update={updateDescription} placeholder="Tell us about your collection"
                />
              : <React.Fragment>{collection.description}</React.Fragment>
            )}
          </p>
          
          {(isAuthorized && <EditCollectionColor
            update={updateColor}
            initialColor={collection.coverColor}
          />
          )}
          
          {(isAuthorized
            ? <button className={`button delete-collection button-tertiary`} 
                onClick={() => 
                {if(!window.confirm(`Are you sure you want to delete your collection?`)){
                    return;
                }
                deleteCollection;
                 // return to profile page
                }} >
              Delete Collection
            </button>
            : null
          )}
          
        </header>
        
        {collection
          ? <ProjectsLoader api={api} projects={collection.projects}>
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
                      />
                      : null
                    )}
                
                  </div>
          
                  {(collection.projects.length > 0 ?
                    (isAuthorized
                      ? <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} api={api} categoryColor={collection.coverColor}
                      projectOptions={{
                        removeProjectFromCollection,
                        addProjectToCollection,
                      }} 
                      {...props}/>

                      : <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} api={api} categoryColor={collection.coverColor} 
                      projectOptions={{
                        addProjectToCollection
                      }} 
                      {...props}/>
                    )
                    :
                    <div className="empty-collection-hint" style={{backgroundColor: collection.coverColor}}>
                        Click <b>Add Project</b> to search for projects to add to your collection.<br/><br/>You can add any project, created by any user.
                      </div>
                    )}
                </div>
          
              </React.Fragment>
            }
          </ProjectsLoader>
        
          : 
          // no collection 
          <React.Fragment>
            <div className="collection-project-container-header">
              <h3>Projects</h3>
                
              {(isAuthorized 
                ? <AddCollectionProject
                  api={api}
                  collectionProjects={null}
                  currentUserIsOwner={isAuthorized}
                  myProjects= {[]}
                />
                : null
              )}
              <div className="empty-collection-hint" style={{backgroundColor: collection.coverColor}}>
                Click <b>Add Project</b> to search for projects to add to your collection.<br/><br/>You can add any project, created by any user.
              </div>
                
            </div>
          
          </React.Fragment>
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
  }else{
    return collectionMatch.id; 
  }
}

async function getCollection(api, collectionId){
  const {data} = await api.get(`collections/${collectionId}`);
  return data;
}

async function loadCollection(api, userLogin, collectionName){
  
  // get userId by login name
  const userId = await getUserIdByLogin(api,userLogin);
  // console.log(`userId: ${userId}`);
  
  // get collection id
  const collectionId = await getCollectionId(api, userId, collectionName);
  // console.log(`collectionId: ${collectionId}`);
  
  // get collection
  const collection = await getCollection(api, collectionId);
  // console.log(`${collection}`);
  
  console.log("load collection %O", collection);
  
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