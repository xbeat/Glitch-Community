// replaces analytics-projects-pop.jade/.js, analytics-project-pop.js/.jade, project-result.js

import React from 'react';
import PropTypes from 'prop-types';

import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

const filterProjects = (query) => {
  console.log(query);
};

const AllProjectsItem = () => {
  const BENTO_BOX = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743';
  return (
    <li className="result">
      <img className="avatar" src={BENTO_BOX} alt='Bento emoji'/>
      <div className="result-name" title="All Projects">All Projects</div>
    </li>
  );
};

const AnalyticsProjectPop = ({projects, action, togglePopover}) => {
  console.log(action);
  const onClick = (...args) => {
    togglePopover();
    action(...args);
  };
  
  return (
    <dialog className="pop-over analytics-projects-pop">
      <section className="pop-over-info">
        <input 
          onChange={(event) => {filterProjects(event.target.value);}} 
          id="analytics-project-filter" 
          className="pop-over-input search-input pop-over-search" 
          placeholder="Filter projects" />
      </section>
      <section className="pop-over-actions results-list">
        <ul className="results">
          < AllProjectsItem />
          { projects.map((project) => (
            <ProjectResultItem key={project.id} {...project} action={onClick}/>
          ))}
        </ul>
      </section>
    </dialog>
  ); 
};

AnalyticsProjectPop.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  action: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

// convert to stateful class, to update buttonname, update loading state

const AnalyticsProjectPopContainer = (props) => {
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button-small button-tertiary" onClick={togglePopover}>All Projects</button>
          {visible && <AnalyticsProjectPop {...props} togglePopover={togglePopover} />}
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
