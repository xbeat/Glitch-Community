import React from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash-es';
import axios from 'axios';
const { CancelToken } = axios;
const source = CancelToken.source();

import ProjectResultItem from '../includes/project-result-item.jsx';
import Loader from '../includes/loader.jsx';
import debounce from 'lodash-es/debounce';

export class AddTeamProjectPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearching: false,
      searchResults: [],
    };

  }
  
  render() {
    // const teamUserIds = () => {
    //   return this.props.teamUsers.map((user) => {
    //     return user.id()
    //   })
    // }

    const debouncedSearchProjects = debounce((query) => {
      const MAX_RESULTS = 20;
      this.props.api(source).get(`projects/search?q=${query}`)
      .then( ({data}) => {
        console.log('🚧', data);
        this.setState({isSearching: false});
        this.setState({searchResults: data});
        // let projects = data
      })
    }, 400);
    
    const searchProjects = (event) => {
      const query = event.target.value
      debouncedSearchProjects(query)
    }

    return (
      <div className="pop-over add-team-project-pop">
        <section className="pop-over-info">
          <input onChange={debouncedSearchProjects} id="team-project-search" className="pop-over-input search-input pop-over-search" placeholder="Search for a project" />
        </section>
        <section className="pop-over-actions results-list">
          { this.state.isSearching && <Loader /> }
          <ul className="results">
            { this.state.searchResults.map((project, key) => (
              <ProjectResultItem key={key} {...project}/>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

AddTeamProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  teamUsers: PropTypes.array.isRequired,
  action: PropTypes.func.isRequired,
}


  
export default AddTeamProjectPop;

// search results
        
//  {
//  { ProjectSearchResults.map((project, key) => (
//    // pass action method down to, addProjectToTeam
//    // project.action = action
//    <ProjectResultItem key={key} {...project} />
//  ))}
// }

// - Loader = require "../includes/loader"

// - ProjectResultItemPresenter = require "../../presenters/project-result-item"

// dialog.pop-over.add-team-project-pop.results-list(class=@hiddenUnlessAddTeamProjectPopVisible click=@stopPropagation)

//   section.pop-over-info
//     input#team-project-search.pop-over-input.search-input.pop-over-search(input=@search keyup=@spacekeyDoesntClosePop placeholder="Search for a project")

//   section.pop-over-actions(class=@hiddenIfNoSearch)
//     span(class=@hiddenUnlessSearching)
//       = Loader(this)
//     ul.results
//       - application = @application
//       - options = {addProjectToTeam: true}
//       - @searchResults().forEach (project) ->
//         = ProjectResultItemPresenter(application, project, options)
//   section.pop-over-info.last-section
//     .info-description You can add projects you've made, or ones by other cool people



// const Observable = require('o_0');
// const _ = require('lodash/function');

// const AddTeamProjectTemplate = require("../../templates/pop-overs/add-team-project-pop");

// module.exports = function(application) {

//   var self = {
  
//     application,
  
//     query: Observable(""),


//     stopPropagation(event) {
//       return event.stopPropagation();
//     },

//     hiddenUnlessSearching() {
//       if (!application.searchingForProjects()) { return 'hidden'; }
//     },

//     spacekeyDoesntClosePop(event) {
//       event.stopPropagation();
//       return event.preventDefault();
//     },      

//     search(event) {
//       const query = event.target.value.trim();
//       self.query(query);
//       application.searchingForProjects(true);
//       return self.searchProjects(query);
//     },

//     searchProjects: _.debounce(function(query) {
//       if (query.length) {
//         return application.searchProjects(query);
//       } 
//       return application.searchingForProjects(false);
        
//     }
//       , 500),

//     searchResults() {
//       const MAX_RESULTS = 10;
//       if (self.query().length) {
//         return application.searchResultsProjects().slice(0, MAX_RESULTS);
//       } 
//       return [];
      
//     },

//     hiddenIfNoSearch() {
//       if (!self.searchResults().length && !application.searchingForProjects()) {
//         return 'hidden';
//       }
//     }, 
//   };


//   return AddTeamProjectTemplate(self);
// };


