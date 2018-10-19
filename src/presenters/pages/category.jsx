import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import CollectionEditor from '../collection-editor.jsx';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import AddCollectionProject from '../includes/add-collection-project.jsx';
import AddCollectionAvatar from '../includes/add-collection-avatar.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';

import {avatars, hexToRgbA} from '../../models/collection.js'; 

import {CurrentUserConsumer} from '../current-user.jsx';

class CollectionColorWrap extends React.Component { 
  constructor(props){
    super(props);
    
    this.state = {
      color: this.props.backgroundColor,
      avatar: this.props.avatarUrl
    };
    this.setColor = this.setColor.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
  }
  
  // static getDerivedStateFromProps(props, state) {
  //   // Any time the current user changes,
  //   // Reset any parts of state that are tied to that user.
  //   // In this simple example, that's just the email.
  //   if (props.collection.color !== this.props.color) {
  //     return {
  //       color: props.collection.color
  //     };
  //   }
  //   return null;
  // }
  
 
  render(){
    return this.props.children(this.state.color, this.state.avatar);
  }
}

const CategoryPageWrap = ({category, api, color, avatar, projectOptions, uploadAvatar, ...props}) => (
  <React.Fragment>
    
    <Helmet>
      <title>{category.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: hexToRgbA(color)}}>
        <header className="collection">
          <h1 className="collection-name">
            <React.Fragment>{category.name} </React.Fragment>
          </h1>
          <div className="collection-image-container">
            <img src={avatar} alt=""/>
          </div>
          
          <p className="description">
            {category.description}
          </p>

          
        </header>
        
        <ProjectsLoader api={api} projects={collection.projects}>
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
          
                  <ProjectsUL projects={projects} categoryColor={color} 
                    projectOptions={{
                      removeProjectFromCollection: removeProject,
                      addProjectToCollection: {addProject}
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
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  addProject: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  isAuthorized: PropTypes.any.isRequired,  
  projectOptions: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

const CollectionPageLoader = ({...props}) => (
  <Loader/>
);

const CollectionPageError = ({...props}) => (
  "Something went wrong. Try refreshing?"  
);

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  
  // TO DO: put this in the collection creation
  // set random name stuff
  randomName();
  return data;
}

async function loadCollection(api, id){
  console.log(`id: ${id}`);
  const {data} = await api.get(`categories/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  return data;
}
  

const CollectionPage = ({api, collection, user, name, addProject, removeProject, ...props}) => (
  <Layout api={api}>
    <DataLoader
      get={() => loadCollection(api, collection.id)}
      renderLoader={() => <CollectionPageLoader collection={collection} api={api} {...props}/>}
      renderError={() => <CollectionPageError collection={collection} api={api} {...props}/>}
    >
      {collection => (
        <CollectionColorWrap collection={collection}>
          {(color, setColor, avatar, setAvatar) => <CategoryPageWrap collection={collection} setColor={setColor} color={color} setAvatar={setAvatar} avatar={avatar} api={api} isAuthorized={true} addProject={addProject} removeProject={removeProject} {...props}/>}
        </CollectionColorWrap>
      )}
    </DataLoader>
  </Layout>
);

CollectionPage.propTypes = {
  api: PropTypes.any.isRequired,
  collection: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
};

export default CollectionPage;