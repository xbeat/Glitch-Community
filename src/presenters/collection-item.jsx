import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import CollectionOptionsContainer from "./pop-overs/collection-options-pop.jsx";
import { CollectionLink, ProjectLink } from './includes/link';
import Loader from './includes/loader';
import CollectionAvatar from './includes/collection-avatar.jsx';

import {getAvatarUrl} from '../models/project.js';

import {getContrastTextColor, hexToRgbA} from '../models/collection';

const ProjectsPreview = ({collection, projects}) => {
  return (
    <>
      <ul className="projects-preview">
        { projects.slice(0,3).map(project => (
          <li key={project.id} className={"project-container " + (project.private ? "private" : '')}>
            <ProjectLink project={project} className="project-link">
              <img className="avatar" src={getAvatarUrl(project.id)} alt={`Project avatar for ${project.domain}`}/>
              <div className="project-name">{project.domain}</div>
              <div className="project-badge private-project-badge" aria-label="private"></div>
            </ProjectLink>
          </li>
        )) }
      </ul>
      <CollectionLink collection={collection} className="collection-link link">
        View {projects.length >= 3 ? "all" : ""} <Pluralize count={projects.length} singular="project"></Pluralize> →
      </CollectionLink>
    </>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired,
};

class CollectionItem extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const {collection, deleteCollection, isAuthorized} = this.props;
    return (
      <li>
        {isAuthorized && (
          <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection}></CollectionOptionsContainer>
        )}

        {(collection &&
          <div className={"collection" + (isAuthorized ? " authorized" : "")} id={"collection-" + collection.id}>
            <div className="collection-container">
              <CollectionLink collection={collection} className="collection-info button-area" style={{backgroundColor: collection.coverColor}}>
                <div>
                  <div className="avatar-container">
                    <div className="avatar">
                      <CollectionAvatar backgroundColor={hexToRgbA(collection.coverColor)} collectionId={collection.id}/>
                    </div>
                  </div>
                </div>
                <div className="collection-name-description button-area">
                  <div className="button">
                    <span className="project-badge private-project-badge" aria-label="private"></span>
                    <div className="project-name">{collection.name}</div>
                  </div>
                  <div className="description" style={{color: getContrastTextColor(collection.coverColor)}}><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
                </div>

                <div className="overflow-mask"></div>
              </CollectionLink>

              {collection.projects ? (collection.projects.length > 0
                ? <ProjectsPreview projects={collection.projects} color={collection.coverColor} collection={collection}/>
                :
                <div className="projects-preview empty">
                  {(isAuthorized
                    ? <p>This collection is empty – add some projects <span role="img" aria-label="">☝️</span></p>
                    : <p>No projects to see in this collection just yet.</p>
                  )}
                </div>
              ) : <div className="collection-link"><Loader/></div>}
            </div>
          </div>
        )}
      </li>
    );
  }
}

CollectionItem.propTypes = {
  collection: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

export default CollectionItem;