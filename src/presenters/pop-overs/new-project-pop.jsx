import React from 'react';

import ProjectResultItem from '../includes/project-result-item.jsx'; // change to -result-list-item
// import Project from 'Project';
// projct-result-item.jsx takes project (w title etc.) , returns html
// replace new project with project result item

const NewProject = ({title, domain, description, avatar}) => {

  return (
    <li>
      <p>{title}</p>
    </li>
  );

};


const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop pop-list">
    <section className="pop-over-actions pop-list-results">
      <ul className="results">
        { newProjects.map((project, key) => (
          <NewProject key={key} {...project}/>
        ))}
      </ul>
    </section>
  </div>
);


export default NewProjectPop;
