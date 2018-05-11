import React from 'react';

import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddTeamUser = ({search, add, members}) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <span className="add-user-container">
        <button onClick={togglePopover} className="button button-small button-tertiary add-user">Add</button>
        {visible && <AddTeamUserPop search={search} add={add} members={members} />}
      </span>
    )}
  </PopoverContainer>
);

export default AddTeamUser;
