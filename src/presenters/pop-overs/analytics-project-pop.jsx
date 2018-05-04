// replaces analytics-projects-pop.jade/.js
import React from 'react';
import PropTypes from 'prop-types';

import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

const BENTO_BOX = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743';

const filteredProjects = (query) => {
  console.log(query);
};

const AnalyticsProjectPop = (props) => {
  console.log('🐊',props);
  return (
    <dialog className="pop-over analytics-projects-pop">
      <section className="pop-over-info">
        <input onChange={(event) => {filteredProjects(event.target.value);}} id="analytics-project-filter" className="pop-over-input search-input pop-over-search" placeholder="Filter projects" />
      </section>
      <section className="pop-over-actions results-list">
        <ul className="results">
          { props.projects.map((project, key) => (
            <ProjectResultItem key={key} {...project}/>
          ))}
        </ul>
      </section>
    </dialog>

  ); 
};

// dialog.pop-over.results-list.analytics-projects-pop.disposable(click=@stopPropagation)

//   section.pop-over-info
//     input#analytics-project-search.pop-over-input.search-input.pop-over-search(input=@filter keyup=@spacekeyDoesntClosePop placeholder="Filter projects")

//   section.pop-over-actions.last-section
//     ul.results
//       .result-container(class=@activeIfAllProjects click=@selectAllProjects)
//         li.result
//           .result-information
//             img.result-avatar(src=bentoBox)
//             .result-name All Projects

//       //- options = {}
//       //- analytics = @analytics
//       - context = @
//       - @teamProjects().forEach (project) ->
//         = context.ProjectResultItem(project)
//         // = ProjectResultItemPresenter(application, project, options, analytics)



AnalyticsProjectPop.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  action: PropTypes.func.isRequired,
};


// convert to stateful class, to update name, update loading state

const AnalyticsProjectPopContainer = (props) => {
  console.log('🏄‍♂️',props);
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button-small button-tertiary" onClick={togglePopover}>All Projects</button>
          {visible && <AnalyticsProjectPop {...props} />}
        </div>
      )}
    </PopoverContainer>
  );
};

export default AnalyticsProjectPopContainer;


// .button-wrap
//   button.button-small.button-tertiary(click=@toggleAnalyticsProjectsPop)
//     span= @analyticsProjectDomain
//     span(class=@hiddenUnlessGettingAnalyticsProjectDomain)= Loader
//   = @analyticsProjectsPop

// - bentoBox = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743'



// import Observable from 'o_0';

// import AnalyticsProjectsPopTemplate from '../../templates/pop-overs/analytics-projects-pop';
// // import ProjectResultPresenter from '../project-result';

// export default function(application, analytics) {

//   var self = {
  
//     application,  
//     teamProjects: Observable(application.team().projects()),
//     analytics,
//     // ProjectResultPresenter,
    
//     stopPropagation(event) {
//       return event.stopPropagation();
//     },

//     filter(event) {
//       const query = event.target.value.trim();
//       const projects = application.team().projects();
//       if (query.length) {
//         const filtered = projects.filter(project => project.domain().match(query) || project.description().match(query));
//         return self.teamProjects(filtered);
//       } 
//       return self.teamProjects(projects);
      
//     },

//     spacekeyDoesntClosePop(event) {
//       event.stopPropagation();
//       return event.preventDefault();
//     },

//     activeIfAllProjects() {
//       if (analytics.analyticsProjectDomain() === 'All Projects') { return 'active'; }
//     },

//     selectAllProjects() {
//       return analytics.analyticsProjectDomain('All Projects');
//     },
//   };
        
//   return AnalyticsProjectsPopTemplate(self);
// }
