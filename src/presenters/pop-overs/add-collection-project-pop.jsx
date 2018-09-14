import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import Notifications from '../notifications.jsx';

const ProjectSearchResults = ({projects, action}) => (
  (projects.length > 0) ? (
    <ul className="results">
      {projects.map(project => (
        <li key={project.id}>
          <ProjectResultItem domain={project.domain} description={project.description} users={project.users} id={project.id} isActive={false} action={() => action(project)} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="results-empty">nothing found <span role="img" aria-label="">💫</span></p>
  )
);

ProjectSearchResults.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  action: PropTypes.func.isRequired,
};

class AddCollectionProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty -- [jude: i suggest the 'maybe' convention for nullable fields with meaning.  'maybeResults'] --greg: i like it
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
      {/* TO DO: SEARCH BY URL */}
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
    });
  }
  
  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }
    
    // check if the query is a URL or a name of a project
    // Project URL pattern: https://glitch.com/~power-port, https://power-port.glitch.me/, https://humorous-spaghetti.glitch.me/~slack-bot-persist
    const httpsKeyword = "https://";
    const glitchKeyword = "glitch";
    let query = this.state.query;
    
    // TO DO - search results needs to match URL exactly, not search only by project name extracted from URL
    if(this.state.query.includes(httpsKeyword) && this.state.query.includes(glitchKeyword)){
      // get project domain
      if(this.state.query.includes("me") && !this.state.query.includes("~")){
        // https://power-port.glitch.me/
        query = query.substring(query.indexOf("//")+"//".length, query.indexOf("."));
      }else if(this.state.query.includes("~") && !this.state.query.includes("me")){
        // https://glitch.com/~power-port
        query = query.substring(query.indexOf("~")+1);
      }else if(this.state.query.includes("~") && this.state.query.includes("me")){
        // https://humorous-spaghetti.glitch.me/~slack-bot-persist
        query = query.substring(query.indexOf("~")+1);
      }
    }
    
    const request = this.props.api.get(`projects/search?q=${query}`);
    this.setState({ maybeRequest: request });
    
    const {data} = await request;
    const results = data.map(project => ProjectModel(project).asProps());
    const nonCollectionResults = results.filter(project => !this.props.collectionProjects || !this.props.collectionProjects.includes(project));
    
    this.setState(({ maybeRequest }) => {
      return (request === maybeRequest) ? {
        maybeRequest: null,
        maybeResults: nonCollectionResults.slice(0, 5),
      } : {};
    });
  }
  
  onClick(project) {
    this.props.togglePopover();
    console.log(`clicked ${project.domain}`);
    
    // show notification
    <Notifications>
      { ({createNotification}) => 
          createNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>)
      }
    </Notifications>
    
    // add project to page if successful
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
            <Notifications>
              {({createNotification}) => (
                  <ProjectSearchResults projects={this.state.maybeResults} action={this.onClick} />
                )}
            </Notifications>
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