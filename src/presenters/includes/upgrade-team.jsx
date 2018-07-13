import React from 'react';
import PropTypes from 'prop-types';

import UpgradeTeamPop from '../pop-overs/upgrade-team-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const UpgradeTeam = ({...props}) => {
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button buttom-small button-cta has-emoji opens-pop-over" onClick={togglePopover}>
            <span>Upgrade {props.teamName} </span>
            <span className="emoji sparkles" />
          </button>
          { visible && <UpgradeTeamPop {...props} togglePopover={togglePopover} /> }
        </div>
      )}
    </PopoverContainer>
  );
};

UpgradeTeam.propTypes = {
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
};

export default UpgradeTeam;
