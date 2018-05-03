import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <div className="results">
        { newProjects.map((project) => (
          <a key={project.id} href={project.link}>
            <ProjectResultItem {...project}/>
          </a>
        ))}
      </div>
    </section>
  </div>
);

NewProjectPop.propTypes = {
  newProjects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  })).isRequired,
};

const NewProjectPopContainer = (props) => {
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button-small" data-track="open new-project pop" onClick={togglePopover}>New Project</button>
          {visible && <NewProjectPop {...props}/>}
        </div>
      )}
    </PopoverContainer>
  );
};

export default NewProjectPopContainer;
