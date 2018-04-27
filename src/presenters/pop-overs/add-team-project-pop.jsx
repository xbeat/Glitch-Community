import React from 'react';
import ProjectResultItem from '../includes/project-result-item.jsx';

import debounce from 'lodash-es/debounce';

// const stopPropagation = (event) => {
//   console.log('🌹')
//   event.stopPropagation()
// }

// put class here
// w state stuff
// reference entity-page-projects.jsx
//   constructor(props) {
//     super(props);
     
//     this.state = {
//       blah: [],
// 
// set state with 
//     this.setStateFromModels = debounce((projectsModel, pinsModel, Component) => {
    //   Component.setState(projectStateFromModels(projectsModel, pinsModel));
    // }, 10);


// mopve searchProjects to class 

const searchProject = (event) => {
  console.log(event.target.value);
  // searchProjects(event.target.value)
  // event.preventDefault()
};

// debounce me
const ProjectSearchResults = (event) => {
  // let searchProjects = {searchProjects}
  // console.log(event)
  // let query = "event.value"
  // return searchProjects(query)
  return [];
};

export class AddTeamProjectPop extends React.Component {


const AddTeamProjectPop = ({searchProjects, action}) => (
  <div className="pop-over add-team-project-pop">
    <section className="pop-over-info">
      <input onChange={searchProject} id="team-project-search" className="pop-over-input search-input pop-over-search" placeholder="Search for a project" />
    </section>
    <section className="pop-over-actions results-list">
      <ul className="results">
        
      </ul>
    </section>
  </div>
);


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

export default AddTeamProjectPop;


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


