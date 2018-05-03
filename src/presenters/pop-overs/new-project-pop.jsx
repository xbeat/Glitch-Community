import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from '../includes/project-result-item.jsx';

const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <div className="results">
        { newProjects.map((project) => (
          <a key={project.id} href={project.url}>
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
    url: PropTypes.number.isRequired,
  })).isRequired,
};

export default NewProjectPop;
