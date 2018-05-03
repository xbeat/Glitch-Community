import React from 'react';
import ProjectResultItem from '../includes/project-result-item.jsx';

const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <ul className="results">
        { newProjects.map((project) => (
          <a key={project.id} href={project.url}>
            <ProjectResultItem {...project}/>
          </a>
        ))}
      </ul>
    </section>
  </div>
);

export default NewProjectPop;
