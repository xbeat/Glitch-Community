import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from "./project-item.jsx"

export const ProjectsList = ({closeAllPopOvers, title, projects, projectOptions}) => {
  
  const self = {

    sectionTitle: title,

    projects() {
      return projects.map(project => Reactlet(ProjectItem, {closeAllPopOvers: application.closeAllPopOvers, project: project.asProps(), projectOptions}));
    },

    visibleIfNoPins() {
      if ((title === 'Pinned Projects') && (projects.length === 0)) {
        return 'visible';
      }
    },

    hiddenUnlessTitleIsPinned() {
      if (title !== 'Pinned Projects') { return 'hidden'; }
    },
  };

  const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";
  
  const isPinned = title === "Pinned Projects";

  return (
    <article className="projects">
    <h2>
      <span>{title}
        { isPinned && <span className="emoji pushpin emoji-in-title"></span> }
      </span>
      </h2>
      
      { !isPinned && (
      <div className="placeholder">
          <img className="psst" src={psst}></img>
          <p>Pin your projects to show them off
          <span className="emoji pushpin"></span></p>
        </div>
      )}
      
      <ul className="projects-container">
        {projects.map(project => Reactlet(ProjectItem, {closeAllPopOvers: application.closeAllPopOvers, project: project.asProps(), projectOptions}));{
        <ProjectItem
      </ul>
    
    </article>
  
    
    article.projects
      h2
        span= @sectionTitle
          span.emoji.pushpin.emoji-in-title(class=@hiddenUnlessTitleIsPinned)
      
      .placeholder.hidden(class=@visibleIfNoPins)
        img.psst(src=psst)
        p Pin your projects to show them off
          span.emoji.pushpin
      ul.projects-container
        = @projects
    );
};

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}



/*


*/