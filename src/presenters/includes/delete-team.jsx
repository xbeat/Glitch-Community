import React from 'react';
import PropTypes from 'prop-types';

import DeleteTeamPop from '../pop-overs/delete-team-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';

const DeleteTeam = ({...props}) => {
  
  return (
    <section>
      <PopoverWithButton buttonClass="button-small button-tertiary has-emoji danger-zone"
        buttonText={<>Delete {props.teamName}&nbsp;<span className="emoji bomb" role="img" aria-label="" /> </>}
        passToggleToPop
      >
        <DeleteTeamPop {...props} />
      </PopoverWithButton>
    </section>
  );
};

DeleteTeam.propTypes = {
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  teamAdmins: PropTypes.array.isRequired,
};

export default DeleteTeam;
