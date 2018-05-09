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
  const onClick = (event, project) => {
    togglePopover();
    action(event, project);
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
          <button className="button-flat" onClick={(event) => {onClick(event, {domain: "All Projects"})}}>
            < AllProjectsItem />
          </button>
          { projects.map((project) => (
            <button key={project.id} className="button-flat" onClick={(event) => {onClick(event, project)}}>
              <ProjectResultItem {...project}/>
            </button>
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

const AnalyticsProjectPopContainer = ({currentDomain, ...props}) => {
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button-small button-tertiary" onClick={togglePopover}>{currentDomain}</button>
          {visible && <AnalyticsProjectPop {...props} togglePopover={togglePopover} />}
        </div>
      )}
    </PopoverContainer>
  );
};

AnalyticsProjectPopContainer.propTypes = {
  currentDomain: PropTypes.string.isRequired,
}

export default AnalyticsProjectPopContainer;
