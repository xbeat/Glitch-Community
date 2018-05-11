import React from 'react';
import PropTypes from 'prop-types';

import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddTeamUser = ({search, add}) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <span className="add-user-container">
        <button onClick={togglePopover} className="button button-small button-tertiary add-user">Add</button>
        {visible && <AddTeamUserPop search={search} />}
      </span>
    )}
  </PopoverContainer>
);

AddTeamUser.propTypes = {
  search: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
};

export default AddTeamUser;
