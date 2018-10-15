// add-collection-project-pop.jsx -> Add a project to a collection via the collection page
import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import Notifications from '../notifications.jsx';

const ProjectSearchResults = ({projects, collection, onClick, projectName}) => (
  (projects.length > 0 && 
   JSON.stringify(collection.projects.map( (project) => project.id).sort()) !== JSON.stringify(projects.map ( (project) => project.id).sort()) ? (
    <ul className="results">
      {projects.map(project => (
        (!collection.projects.map( (project) => project.id).includes(project.id) &&
          <Notifications>
            {({createNotification}) => (
              <li key={project.id}>
                <ProjectResultItem domain={project.domain} description={project.description} users={project.users} id={project.id} isActive={false} collection={collection} action={() => onClick(project, collection, createNotification)} />
              </li>
            )}
          </Notifications>
         )
      ))}
    </ul>
  ) : 
    (projectName ? (
      <p className="results-empty">{projectName} is already in this collection <span role="img" aria-label="">💫</span></p>
      ): 
    (<p className="results-empty">nothing found <span role="img" aria-label="">💫</span></p>)
    )
   )           
);

ProjectSearchResults.propTypes = {
  collection: PropTypes.object.isRequired,
  projectName: PropTypes.string,
};

function validURL(str){
 var pattern = new RegExp('^(https?:\/\/)?'+ '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ '((\d{1,3}\.){3}\d{1,3}))'+ ) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

class AddCollectionProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty,
      projectName: '', // the project name if the search result is a Url
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
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
    console.log('clear search');
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
    
    if(validURL(query)){
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
    
    console.log(`query: ${query}`);
    const request = this.props.api.get(`projects/search?q=${query}`);
    this.setState({ maybeRequest: request });
    
    const {data} = await request;
    const results = data.map(project => ProjectModel(project).asProps());
    console.log("results %O", results);
    
    // console.log("this.props.collection.projects %O", this.props.collection.projects);
    
    let nonCollectionResults = null;
    if(searchByUrl){
      // find all projects that have the same domain as the query
      let projectByDomain = results.filter(project => project.domain == query);
      
      
      if(this.props.collection.projects.find(project => project.domain == query)){
        nonCollectionResults =[];
        this.setState({projectName: query});
      }else{
        nonCollectionResults = projectByDomain;
      }      
    }else{
      if(this.props.collection.projects.find(project => project.domain == query)){
        nonCollectionResults = [];
        this.setState({projectName: query});
      }else{
        nonCollectionResults = results.filter(project => !this.props.collection.projects || !this.props.collection.projects.includes(project));
      }
    }

    this.setState(({ maybeRequest }) => {
    return (request === maybeRequest) ? {
      maybeRequest: null,
      maybeResults: nonCollectionResults,
      } : {};
    });

  }
  
  onClick(project, collection, createNotification) {
    this.props.togglePopover();
    console.log(`clicked ${project.domain}`);
    
    // add project to page if successful
    this.props.addProjectToCollection(project, collection);
    
    // show notification
    createNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>, "notifySuccess")
  }
  
  render() {
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <input id="team-user-search" 
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search by project name or URL"
          />
        </section>
        {!!this.state.query && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
          {!!this.state.maybeResults && 
              <ProjectSearchResults projects={this.state.maybeResults} onClick={this.onClick} collection={this.props.collection} projectName={this.state.projectName}/>
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
};

export default AddCollectionProjectPop;