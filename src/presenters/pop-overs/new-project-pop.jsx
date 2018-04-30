import React from 'react';
import ProjectResultItem from '../includes/project-result-item.jsx';

const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <ul className="results">
        { newProjects.map((project, key) => (
          <a href={project.url}>
            <ProjectResultItem key={key} {...project}/>
          </a>
        ))}
      </ul>
    </section>
  </div>
);

export default NewProjectPop;
