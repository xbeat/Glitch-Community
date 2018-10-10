import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import Notifications from '../notifications.jsx';

const ProjectSearchResults = ({projects, action, projectName}) => (
  (projects.length > 0) ? (
    <ul className="results">
      {projects.map(project => (
        <Notifications>
          {({createNotification}) => (
            <li key={project.id}>
              <ProjectResultItem domain={project.domain} description={project.description} users={project.users} id={project.id} isActive={false} action={() => action(project, createNotification)} />
            </li>
          )}
        </Notifications>
      ))}
    </ul>
  ) : 
    (projectName ? (
      <p className="results-empty">{projectName} is already in this collection <span role="img" aria-label="">💫</span></p>
      ): 
    (<p className="results-empty">nothing found <span role="img" aria-label="">💫</span></p>)
    )
);

ProjectSearchResults.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  action: PropTypes.func.isRequired,
  projectName: PropTypes.sting,
};

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
    // Project URL pattern: https://glitch.com/~power-port, https://power-port.glitch.me/, https://humorous-spaghetti.glitch.me/~slack-bot-persist, https://community.glitch.me/
    const httpsKeyword = "https://";
    const glitchKeyword = "glitch";
    let searchByUrl = false;
    let query = this.state.query;
    
    // TO DO - search results needs to match URL exactly, not search only by project name extracted from URL
    if(this.state.query.includes(httpsKeyword) && this.state.query.includes(glitchKeyword)){
      searchByUrl = true;
      // get project domain
      if(query.includes("me") && !query.includes("~")){
        // https://power-port.glitch.me/
        query = query.substring(query.indexOf("//")+"//".length, query.indexOf("."));
      }else if(query.includes("~") && !query.includes(".me")){
        // https://glitch.com/~power-port
        query = query.substring(query.indexOf("~")+1);
      }else if(query.includes("~") && query.includes("me")){
        // https://humorous-spaghetti.glitch.me/~slack-bot-persist
        query = query.substring(query.indexOf("~")+1);
      }else if(query.includes(".me")){
        // https://community.glitch.me/
        if(query.includes("https://")){
          query = query.substring(query.indexOf("https://")
        }else if(query.includes("http://")){
        }
      }
    }
    console.log(`query: ${query}`);
    const request = this.props.api.get(`projects/search?q=${query}`);
    this.setState({ maybeRequest: request });
    
    const {data} = await request;
    const results = data.map(project => ProjectModel(project).asProps());
    
    console.log("this.props.collectionProjects %O", this.props.collectionProjects);
    let nonCollectionResults = null;
    if(searchByUrl){
      let projectByDomain = results.filter(project => project.domain == query);
      console.log("projectByDomain %O", projectByDomain);
      // get names of all collectionProjects
      if(this.props.collectionProjects.find(project => project.domain == query)){
        nonCollectionResults =[];
        this.setState({projectName: query});
        console.log(` set state to ${this.state.projectName} with query ${query}`);
      }else{
        nonCollectionResults = projectByDomain;
      }      
    }else{
      nonCollectionResults = results.filter(project => !this.props.collectionProjects || !this.props.collectionProjects.includes(project));
    }

    this.setState(({ maybeRequest }) => {
    return (request === maybeRequest) ? {
      maybeRequest: null,
      maybeResults: nonCollectionResults.slice(0, 5),
      } : {};
    });

  }
  
  onClick(project, createPersistentNotification) {
    this.props.togglePopover();
    console.log(`clicked ${project.domain}`);
    
    // add the project to the collection
    
    // show notification
    createPersistentNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>, "notifySuccess")
    
    // add project to page if successful
    this.props.addProject(project);
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
              <ProjectSearchResults projects={this.state.maybeResults} action={this.onClick} projectName={this.state.projectName}/>
          }
        </section>}
      </dialog>
    );
  }
}

AddCollectionProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  collectionProjects: PropTypes.any.isRequired,
  togglePopover: PropTypes.array.isRequired,
};

export default AddCollectionProjectPop;