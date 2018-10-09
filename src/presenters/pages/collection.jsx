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

import {avatars} from '../../models/collection.js'; 

import {UserTile} from '../users-list.jsx';

import {CurrentUserConsumer} from '../current-user.jsx';

const hexToRgbA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
  }
  throw new Error('Bad Hex');
};

const CollectionPage = ({
  collection, 
  api, 
  isAuthorized, 
  updateName, 
  updateDescription, 
  projectOptions, 
  uploadAvatar, 
  addProject, 
  removeProject,
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
          
          <EditCollectionColor
            currentUserIsOwner={true}
            update={updateColor}
          />
          
          {(isAuthorized
            ? <button className={`button delete-collection button-tertiary`} >
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
                        addProject={addProject}
                        api={api}
                        collectionProjects={collection.projects}
                        currentUserIsOwner={true}
                      />
                      : null
                    )}
                
                  </div>
          
                  {(isAuthorized
                    ? <ProjectsUL projects={projects} categoryColor={collection.coverColor} 
                    projectOptions={{
                      removeProjectFromCollection: {removeProject},
                      addProjectToCollection: {addProject},
                    }} 
                    {...props}/>
                    
                    : <ProjectsUL projects={projects} categoryColor={collection.coverColor} 
                    projectOptions={{
                      addProjectToCollection: {addProject}
                    }} 
                    {...props}/>
                  )}
                </div>
          
              </React.Fragment>
            }
          </ProjectsLoader>
        
          : 
          <React.Fragment>
            <div className="collection-project-container-header">
              <h3>Projects</h3>
                
              {(isAuthorized 
                ? <AddCollectionProject
                  api={api}
                  collectionProjects={null}
                  currentUserIsOwner={true}
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

CollectionPage.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  addProject: PropTypes.func,
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  children: PropTypes.node,
  isAuthorized: PropTypes.any.isRequired,  
  projectOptions: PropTypes.object,
  removeProject: PropTypes.func,
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

const CollectionPageLoader = ({api, userLogin, name, addProject, removeProject, ...props}) => (
  <Layout api={api}>
    <DataLoader get={() => loadCollection(api, userLogin, name)}
      renderError={() =>  "Something went wrong. Try refreshing?"}
    >
      {collection => (
        <CollectionEditor api={api} initialCollection={collection}>
          {(collection, funcs) =>(
              <CollectionPage collection={collection} userLogin={userLogin} api={api} isAuthorized={true} addProject={addProject} removeProject={removeProject} {...funcs} {...props}/>
                )
          }
        </CollectionEditor>
      )}
    </DataLoader>
  </Layout>
);

CollectionPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  addProject: PropTypes.func,
  removeProject: PropTypes.func,
}

export default CollectionPageLoader;