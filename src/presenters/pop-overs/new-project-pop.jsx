import React from 'react';
import ProjectResultItem from '../includes/project-result-item.jsx';

const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <ul className="results">
        { newProjects.map((project, key) => (
          <ProjectResultItem key={key} {...project}/>
        ))}
      </ul>
    </section>
  </div>
);

export default NewProjectPop;
