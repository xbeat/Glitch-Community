import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

const CollectionPageWrap = ({collection, children}) => (
  <React.Fragment>
    <Helmet>
      <title>{collection.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: collection.backgroundColor}}>
        <header className="collection">
          <h2 className="collection-name">{collection.name}</h2>
          <div className="collection-image-container">
            <img src={collection.avatarUrl} alt=""/>
          </div>
           <div className="button button-secondary">
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

const CollectionPage = ({api, collection, ...props}) => (
  <DataLoader
    get={() => loadCategory(api, collection.id)}
    renderLoader={() => <CollectionPageLoader collection={collection} {...props}/>}
    renderError={() => <CollectionPageError collection={collection} {...props}/>}
  >
    {collection => (
      <CollectionPageWrap collection={collection} {...props}>
        <ProjectsLoader api={api} projects={collection.projects}>
          {projects => <ProjectsUL projects={projects} collectionColor={collection.color}/>}
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