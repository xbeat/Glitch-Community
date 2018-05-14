import React from 'react';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddTeamProject = (props) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <div className="button-wrap">
        <button className="button add-project has-emoji opens-pop-over" onClick={togglePopover}>
          Add Project <span className="emoji bento-box" role="img" aria-label=""></span>
        </button>
        { visible && <AddTeamProjectPop {...props} togglePopover={togglePopover} /> }
      </div>
    )}
  </PopoverContainer>
);

export default AddTeamProject;
