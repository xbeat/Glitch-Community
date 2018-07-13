import React from 'react';
import PropTypes from 'prop-types';

import UpgradeTeamPop from '../pop-overs/upgrade-team-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const UpgradeTeam = ({...props}) => {
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button buttom-small button-cta has-emoji">
              <span>Upgrade {this.props.teamName} </span>
              <span className="emoji sparkles" />
            </button>
            { visible && <UpgradeTeamPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
    </section>
  );
};

UpgradeTeam.propTypes = {
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default UpgradeTeam;
