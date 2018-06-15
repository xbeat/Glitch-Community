import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from "./projects-list.jsx";
// import Observable from "o_0";
// import {debounce} from 'lodash';


/* globals Set */

// const projectStateFromModels = (projectsModel, pinsModel) => {
//   const pinnedIds = pinsModel.map(({projectId}) => projectId);
//   const pinnedSet = new Set(pinnedIds);
//   const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
//   const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
//   const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
//   return {pinnedProjects, recentProjects};
// };

// export class EntityPageProjectsContainer extends React.Component {
  
//   constructor(props) {
//     super(props);
     
//     this.state = {
//       recentProjects: [],
//       pinnedProjects: [],
//     };
    
//     this.aggregateObservable = null;
//     this.setStateFromModels = debounce((projectsModel, pinsModel, Component) => {
//       Component.setState(projectStateFromModels(projectsModel, pinsModel));
//     }, 10);
//   }
  
//   componentDidMount() {
//     this.aggregateObservable = Observable(() => {
//       const projectsModel = this.props.projectsObservable();
//       const pinsModel = this.props.pinsObservable();
//       // Subscribe just to the 'fetched' subcomponent of the projects.
//       for(let {fetched} of projectsModel) {
//         fetched && fetched();
//       }
//       this.setStateFromModels(projectsModel, pinsModel, this);
//     });
//   }
  
//   componentWillUnmount(){
//     this.aggregateObservable && this.aggregateObservable.releaseDependencies();
//     this.aggregateObservable = null;
//   }

//   render() {
//     return <EntityPageProjects {...this.props} {...this.state}/>;
//   }
// }

// EntityPageProjectsContainer.propTypes = {
//   projectsObservable: PropTypes.array.isRequired,
//   pinsObservable: PropTypes.func.isRequired,
//   isAuthorizedUser: PropTypes.bool.isRequired,
//   closeAllPopOvers: PropTypes.func.isRequired,
//   projectOptions: PropTypes.object.isRequired,
// };

// const recentProjects = (projects, pinnedProjects) => {
  
//   let x = projects.filter( (project) => !pinnedSet.has(project.id))
// }

// const pinIds = (pinnedProjects) => {
  
// }





const recentProjectsArray = (projects, pinnedProjects) => {
  return recents
};

const EntityPageProjects = ({closeAllPopOvers, isAuthorizedUser, projects, pinnedProjects, projectOptions}) => {
  if (projects.length === 0) {
    console.log ('💣')
    return null
  }

  
  const commonProps = {
    closeAllPopOvers,
    projectOptions,
  };
  
  let recentProjects = recentProjectsArray(projects, pinnedProjects)
  
    let pinIds = pinnedProjects.map(pin => {
    return pin.projectId
  });
  
  let recents = projects.filter(project => {
    return !pinIds.includes(project.id)
  });

  
  console.log ('👍', recentProjects)

  
  const showPinnedProjects = isAuthorizedUser || pinnedProjects.length !== 0;
  return (
    <React.Fragment>
      { showPinnedProjects && (
        <ProjectsList title="Pinned Projects" isPinned={true} projects={pinnedProjects} {...commonProps}/>
      )}
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

EntityPageProjects.propTypes = {
  pinnedProjects: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
};

export default EntityPageProjects;
