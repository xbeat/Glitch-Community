import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

import CollectionEditor from '../collection-editor.jsx';

import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';

import PopoverContainer from '../pop-overs/popover-container.jsx';

import {CurrentUserConsumer} from '../current-user.jsx';

const CategoryPageWrap = ({category, api, projectOptions, addProjectToCollection, ...props}) => (
  <React.Fragment>
    
    <Helmet>
      <title>{category.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: category.backgroundColor}}>
        <header className="collection">
          <h1 className="collection-name">
            <React.Fragment>{category.name} </React.Fragment>
          </h1>
          <div className="collection-image-container">
            <img src={category.avatarUrl} alt=""/>
          </div>
          
          <p className="description">
            {category.description}
          </p>

          
        </header>
        
        <ProjectsLoader api={api} projects={category.projects}>
            {projects => 
              <React.Fragment>
                <div className="collection-contents">
                  <div className="collection-project-container-header">
                    <h3>Projects ({category.projects.length})</h3>
                  </div>
          
                  <ProjectsUL projects={projects} collectionColor={category.color} 
                    projectOptions={{
                      addProjectToCollection: {addProjectToCollection}
                    }} 
                    {...props}/>
                </div>
          
              </React.Fragment>
            }
          </ProjectsLoader>
        
      </article>
      
    </main>
    <Categories/>
  </React.Fragment>
);

CategoryPageWrap.propTypes = {
  category: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  isAuthorized: PropTypes.any.isRequired,  
  projectOptions: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
};

const CategoryPageLoader = ({...props}) => (
  <Loader/>
);

const CategoryPageError = ({...props}) => (
  "Something went wrong. Try refreshing?"  
);

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  return data;
}  

const CategoryPage = ({api, category, user, name, addProjectToCollection, ...props}) => (
  <Layout api={api}>
    <DataLoader
      get={() => loadCategory(api, category.id)}
      renderLoader={() => <CategoryPageLoader category={category} api={api} {...props}/>}
      renderError={() => <CategoryPageError category={category} api={api} {...props}/>}
    >
      {category => (
        <CategoryPageWrap category={category} api={api} {...props}/>
      )}
    </DataLoader>
  </Layout>
);

CategoryPage.propTypes = {
  api: PropTypes.any.isRequired,
  category: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

export default CategoryPage;