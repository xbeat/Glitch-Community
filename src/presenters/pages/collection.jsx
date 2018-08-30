import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import AddProjectPop from '../pop-overs/add-project-pop.jsx';

const CollectionPageWrap = ({collection, children}) => (
  <React.Fragment>
    <Helmet>
      <title>{collection.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: collection.backgroundColor}}>
        <header className="collection">
          <h1 className="collection-name">{collection.name}</h1>
          <div className="collection-image-container">
            <img src={collection.avatarUrl} alt=""/>
          </div>
           <div className="button button-tertiary">
            <div className="collection-avatar">Replace Avatar</div>
          </div>
          
          <p className="description">{collection.description}</p>
           <div className="button">
              <div className="collection-color">Color</div>
            </div>
        </header>
        {children}
      </article>
    </main>
    <Categories/>
  </React.Fragment>
);
CollectionPageWrap.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

const CollectionPageLoader = ({...props}) => (
  <CollectionPageWrap {...props}>
    <Loader/>
  </CollectionPageWrap>
);

const CollectionPageError = ({...props}) => (
  <CollectionPageWrap {...props}>
    Something went wrong. Try refreshing?
  </CollectionPageWrap>
);

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  return data;
}

const AddProject = (props) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <span className="add-project-container">
        <button onClick={togglePopover} className="button collection-add-project-button">Add Project</button>
        {visible && 
          <AddProjectPop 
            {...props}
            togglePopover={togglePopover}
          />
        }
      </span>
    )}
  </PopoverContainer>
);

  

const CollectionPage = ({api, collection, ...props}) => (
  <DataLoader
    get={() => loadCategory(api, collection.id)}
    renderLoader={() => <CollectionPageLoader collection={collection} {...props}/>}
    renderError={() => <CollectionPageError collection={collection} {...props}/>}
  >
    {collection => (
      <CollectionPageWrap collection={collection} {...props}>
        <ProjectsLoader api={api} projects={collection.projects}>
          {projects => 
            <React.Fragment>
              <h3 className="collection-project-header">Projects ({collection.projects.length})</h3>
            
              <AddProject
                api={api}
              />
          
              {/*  
              <div className="button collection-add-project-button">
                <div>Add Project</div>
              </div>
              */}
          
              <ProjectsUL projects={projects} categoryColor={collection.color}/>
            </React.Fragment>
          }
        </ProjectsLoader>
      </CollectionPageWrap>
    )}
  </DataLoader>
);
CollectionPage.propTypes = {
  api: PropTypes.any.isRequired,
  collection: PropTypes.object.isRequired,
};

const CollectionPageContainer = ({api, collection}) => (
  <Layout api={api}>
    <CollectionPage api={api} collection={collection}/>
  </Layout>
);

export default CollectionPageContainer;