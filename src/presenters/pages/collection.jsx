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

import PopoverContainer from '../pop-overs/popover-container.jsx';
import AddCollectionProject from '../includes/add-collection-project.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';

class CollectionColorWrap extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      color: this.props.collection.color
    };
    this.setColor = this.setColor.bind(this);
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
  
  setColor(newColor){
    this.setState({
      color: newColor
    });
    console.log(`newColor: ${newColor}`);
  }
  
  render(){
    return this.props.children(this.state.color, this.setColor);
  }
};

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

const CollectionPageWrap = ({collection, api, color, setColor, isAuthorized, updateName, updateDescription, projectOptions, ...props}) => (
  <React.Fragment>
    
    <Helmet>
      <title>{collection.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: hexToRgbA(color)}}>
        <header className="collection">
          <h1 className="collection-name">
            {/* TO DO: actually update name */}
            {(isAuthorized 
              ? <AuthDescription authorized={isAuthorized}
                  description={collection.name} 
                  update={updateName => null} 
                  placeholder="Name your collection"/> 
              : <React.Fragment>{collection.name} </React.Fragment>
             )}
          </h1>
          <div className="collection-image-container">
            <img src={collection.avatarUrl} alt=""/>
          </div>
              {/* TO DO: actually enable uploading avatar - see example of uploadAvatar in user-editor.jsx */}
             {isAuthorized 
               ? <div className="upload-image-buttons">
                   <button className="button button-small button-tertiary" onClick={null}>
                     <span>Replace Avatar</span>  
                   </button>
                 </div>
               : null
             }
          
          <p className="description">
            {/* TO DO: actually update description */}
            <AuthDescription
              authorized={isAuthorized} description={collection.description}
              update={updateDescription => null} placeholder="Tell us about your collection"
            />
          </p>
          
          
          <EditCollectionColor
            api={api}
            collectionID={collection.id}
            currentUserIsOwner={true}
            setColor={setColor}
          />
          
          {(isAuthorized
            ? <button className={`button delete-collection button-tertiary`} >
              Delete Collection
            </button>
            : null
          )}
          
          {/*
          <div className="button">
              <div className="collection-color">Color</div>
            </div>
          */}
          
        </header>
        
        <ProjectsLoader api={api} projects={collection.projects}>
          {projects => 
            <React.Fragment>
              <div class="collection-project-container-header">
                <h3>Projects ({collection.projects.length})</h3>
                
                {(isAuthorized 
                    ? <AddCollectionProject
                        api={api}
                        collectionProjects={collection.projects}
                        currentUserIsOwner={true}
                        myProjects= {[]}
                      />
                    : null
                  )}
                
              </div>
          
              <ProjectsUL projects={projects} categoryColor={color} 
                projectOptions={{
                    removeProjectFromCollection: null
                }} 
                {...props}/>
          
            </React.Fragment>
          }
        </ProjectsLoader>
        
      </article>
      
      {/*
      <div class="buttons buttons-right">
        {(isAuthorized
          ? <button className={`button delete-collection button-small`} >
            Delete Collection
          </button>
          : null
          )}
      </div>   
      */}
      
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
    projects: PropTypes.array.isRequired
  }).isRequired,
  isAuthorized: PropTypes.any.isRequired,
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  projectOptions: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
};

const CollectionPageLoader = ({...props}) => (
    <Loader/>
);

const CollectionPageError = ({...props}) => (
  "Something went wrong. Try refreshing?"  
);

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  return data;
}
  

const CollectionPage = ({api, collection, removeProject, ...props}) => (
  <Layout api={api}>
    <DataLoader
      get={() => loadCategory(api, collection.id)}
      renderLoader={() => <CollectionPageLoader collection={collection} api={api} {...props}/>}
      renderError={() => <CollectionPageError collection={collection} api={api} {...props}/>}
    >
      {collection => (
        <CollectionColorWrap collection={collection}>
          {(color, setColor) => <CollectionPageWrap collection={collection} setColor={setColor} color={color} api={api} isAuthorized={true} removeProject={null} {...props}/>}
        </CollectionColorWrap>
      )}
    </DataLoader>
  </Layout>
);

CollectionPage.propTypes = {
  api: PropTypes.any.isRequired,
  collection: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
};

export default CollectionPage;