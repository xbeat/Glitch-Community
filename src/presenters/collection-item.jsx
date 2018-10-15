import React from 'react';
import PropTypes from 'prop-types';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectModel from '../models/project';
import CollectionOptionsContainer from "./pop-overs/collection-options-pop.jsx";
import UsersList from "./users-list.jsx";

import Loader, {DataLoader} from './includes/loader.jsx';
import ProjectsLoader from './projects-loader.jsx';

import {getAvatarUrl, getLink} from '../models/project.js';

import UserModel from '../models/user'; 

const colors = ["rgba(84,248,214,0.40)", "rgba(229,229,229,0.40)", "rgba(255,163,187,0.40)", "rgba(251,160,88,0.40)", "rgba(252,243,175,0.40)", "rgba(48,220,166,0.40)", 
  "rgba(103,190,255,0.40)", "rgba(201,191,244,0.40)"];

// SOME DUMMY DEFAULT STUFF
const defaultUrl = "/favorites";
const defaultName = "Favorites";

const ProjectsPreview = ({projects, categoryColor}) => {
  return (
    <React.Fragment>
      <div className="projects-preview" projects={projects}>
        { projects.slice(0,3).map(project => (
          <div className="project-container">
            <img className="avatar" src={getAvatarUrl(project.id)}/>
            <div className="project-name">{project.domain}</div>
          </div>
        )) }
      </div>
      <div className="collection-link">
          View {projects.length} {(projects.length > 0 ? 'projects' : 'project')} →
      </div>
    </React.Fragment>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired,
};

async function getCollectionUrl(api, userId, collectionUrl){
  const {data} = await api.get(`users/${userId}`);
  const username = data.login;
  let path = `/@${username}/${collectionUrl}`;
  // console.log(`path: ${path}`);
  return path;
}


export const CollectionItem = ({collection, categoryColor, deleteCollection, api, isAuthorized}) => {
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <li>
      <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection}></CollectionOptionsContainer>

      {(collection  
        ? <DataLoader
          get={() => getCollectionUrl(api, collection.userId, collection.url)}
          renderLoader={() => <Loader />}
          renderError={() => <div>Something went wrong. Try refreshing?</div>}
          >
           {path => (
              <a href={path}>
                <div className={['collection']} 
                  style={{backgroundColor: collection.coverColor, borderBottomColor:collection.coverColor}}>
                  <div className="collection-container">
                      <div className="collection-info">
                        <div className="avatar-container">
                          <img className="avatar" src={collection.avatarUrl}/>
                        </div>
                        <div className="collection-name-description">
                            <div className="button">
                              <span className="project-badge private-project-badge" aria-label="private"></span>
                              <div className="project-name">{collection.name}</div>
                            </div>
                          <div className="description"><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
                        </div>

                        <div className="overflow-mask"></div>
                      </div>

                      <DataLoader
                        get={() => loadCollection(api, collection.id)}
                        renderLoader={() => <Loader />}
                        renderError={() => <div>Something went wrong. Try refreshing?</div>}
                        >
                          {collection => (
                            collection.projects.length > 0
                              ?
                              <ProjectsLoader api={api} projects={collection.projects}>
                                {projects => <ProjectsPreview projects={collection.projects} categoryColor={collection.color}/>}
                              </ProjectsLoader>
                             :
                             <div className="projects-preview empty">
                                {(isAuthorized
                                  ? <a href={defaultUrl}>This collection is empty.  Add some projects to it!</a>
                                  : "No projects to see in this collection just yet."
                                )}
                              </div>
                          )}
                      </DataLoader>   
                  </div>
                </div>
              </a>             
            )}
          </DataLoader>
        : 
        // empty collection
        <a href={defaultUrl}>
          <div className={['collection']} >
            <div className="collection-container">

                <div className="collection-info">
                  <img className="avatar" src={"https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"}/>
                  <div className="collection-name-description">
                      <div className="button">
                        <span className="project-badge private-project-badge" aria-label="private"></span>
                        <div className="project-name">{defaultName}</div>
                      </div>
                    <div className="description"><TruncatedMarkdown length={96}>{"A collection of my favorite projects"}</TruncatedMarkdown></div>
                  </div>

                  <div className="overflow-mask"></div>
                </div>

               <div className="projects-preview empty">
                  {(isAuthorized
                    ? <a href={defaultUrl}>This collection is empty.  Add some projects to it!</a>
                    : "No projects to see in this collection just yet."
                  )}
              </div>

            </div>
          </div>
      </a>
      )}
    </li>
  );
};

CollectionItem.propTypes = {
  api: PropTypes.func.isRequired,
  categoryColor: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func
};

async function loadCollection(api, id){
  const {data} = await api.get(`collections/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  return data;
}

export default CollectionItem;