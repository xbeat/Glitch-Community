import React from 'react';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

/*
  section.add-project-container
    .button-wrap
      button.button.add-project.has-emoji.opens-pop-over(class=@hiddenUnlessCurrentUserIsOnTeam click=@toggleAddTeamProjectPop) Add Project
        .emoji.bento-box
      span(class=@hiddenUnlessAddTeamProjectPopVisible)
        = @addTeamProjectPop
        */
const AddTeamProject = (props) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <div className="button-wrap">
        <button className="button add-project has-emoji opens-pop-over" onClick={togglePopover}>
          Add Project <span className="emoji bento-box" role="image" aria-label=""></span>
        </button>
        { visible && <AddTeamProjectPop {...props} /> }
      </div>
    )}
  </PopoverContainer>
);

export default AddTeamProject;
