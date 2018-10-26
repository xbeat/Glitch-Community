// add-collection-project-pop.jsx -> Add a project to a collection via the collection page
import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import ProjectsLoader from '../projects-loader.jsx';

import Notifications from '../notifications.jsx';  

const ProjectSearchResults = ({projects, collection, onClick, projectName, excludedProjectsCount}) => (
  (projects.length > 0 ? (
    <ul className="results">
      {projects.map(project => (
        (!collection.projects.map( (project) => project.id).includes(project.id) &&
          <Notifications key={project.id}>
            {({createNotification}) => (
              <li>
                <ProjectResultItem domain={project.domain} description={project.description} users={project.users} id={project.id} isActive={false} collection={collection} action={() => onClick(project, collection, createNotification)} />
              </li>
            )}
          </Notifications>
        )
      ))}
    </ul>
  ) : 
    (projectName 
      ? <p className="results-empty">{projectName} is already in this collection <span role="img" aria-label="">💫</span></p>
      : <p className="results-empty">
        nothing found <span role="img" aria-label="">💫</span><br/>
        {excludedProjectsCount > 0 && <span>(Excluded {excludedProjectsCount} search {(excludedProjectsCount > 1 ? "results" : "result")} already found in collection)</span>}
      </p>
    )           
  )
);

ProjectSearchResults.propTypes = {
  collection: PropTypes.object.isRequired,
  projectName: PropTypes.string,
};

function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

class AddCollectionProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty,
      projectName: '', // the project name if the search result is a Url
      omittedProjectCount: 0, // number of projects omitted from search
      showRecentProjects: true, // by default, show user's 4 most recent projects
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
  }
  
  componentDidMount(){
    // load user's recent projects to show in dropdown by default
    let MAX_PROJECTS = 20;
    this.setState({ maybeResults: this.props.currentUser.projects.slice(0,MAX_PROJECTS) });
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
      projectName: '',
    });
  } 
  
  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }
    
    // check if the query is a URL or a name of a project
    // Project URL pattern: https://glitch.com/~power-port, https://power-port.glitch.me/, https://community.glitch.me/
    let searchByUrl = false;
    let query = this.state.query;
    
    if(isUrl(query)){
      searchByUrl = true;
      // get project domain
      if(query.includes("me") && !query.includes("~")){
        // https://power-port.glitch.me/
        query = query.substring(query.indexOf("//")+"//".length, query.indexOf("."));
      }else if(query.includes("~") && !query.includes(".me")){
        // https://glitch.com/~power-port
        query = query.pathname.substring(query.indexOf("~")+1);
      }else if(query.includes(".me")){
        // https://community.glitch.me/
        query = query.host.substring(0, query.indexOf("."));
      }
    }
    
    const request = this.props.api.get(`projects/search?q=${query}`);
    this.setState({ maybeRequest: request });
    
    const {data} = await request;
    const results = data.map(project => ProjectModel(project).asProps()); 
    let originalNumResults = results.length;
    
    let nonCollectionResults = null;
    if(searchByUrl){  
      if(this.props.collection.projects.map( (project) => project.domain).includes(query)){
        // the domain already exists in the collection - return an empty array
        nonCollectionResults =[];
        this.setState({projectName: query});
      }else{
        // return results, filtering out any projects currently in collection
        nonCollectionResults = this.props.collection.projects.filter(project => project.domain == query);
      }      
    }else{
      // user is searching by project name or URL  - filter out any projects currently in the collection
      let collectionProjectIds = this.props.collection.projects.map( (project) => project.id);
      nonCollectionResults = results.filter( result => !collectionProjectIds.includes(result.id));
      
      if(this.props.collection.projects.map( (project) => project.domain).includes(query) && nonCollectionResults.length == originalNumResults){
        this.setState({projectName: query});
      }
    }
    
    this.setState({excludedProjectsCount: originalNumResults - nonCollectionResults.length});

    this.setState(({ maybeRequest }) => {
      return (request === maybeRequest) ? {
        maybeRequest: null,
        maybeResults: nonCollectionResults,
        recentProjects: null,
      } : {};
    });

  }
  
  onClick(project, collection, createNotification) {
    this.props.togglePopover();
    
    // add project to page if successful
    this.props.addProjectToCollection(project, collection);
    
    // show notification
    createNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>, "notifySuccess");
  }
  
  render() {
    // load user's recent projects
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    
    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <input
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search by project name or URL"
          />
        </section>
        {(!!this.state.query || this.state.maybeResults) && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
        
          {!!this.state.maybeResults && 
              <ProjectsLoader api={this.props.api} projects={this.state.maybeResults}>
                {(projects) => <ProjectSearchResults projects={this.state.maybeResults} onClick={this.onClick} collection={this.props.collection} projectName={this.state.projectName} excludedProjectsCount={this.state.excludedProjectsCount}/>
                }
              </ProjectsLoader>
          }          
        </section>}
      </dialog>
    );
  }
}

AddCollectionProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default AddCollectionProjectPop;