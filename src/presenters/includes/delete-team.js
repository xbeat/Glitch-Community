import React from 'react';
import PropTypes from 'prop-types';

import PopoverWithButton from 'src/components/popovers/popover-with-button';
import DeleteTeamPop from 'src/presenters/pop-overs/delete-team-pop';

const DeleteTeam = ({ ...props }) => (
  <section>
    <PopoverWithButton
      buttonClass="button-small button-tertiary has-emoji danger-zone"
      buttonText={
        <>
          Delete {props.teamName}
          &nbsp;
          <span className="emoji bomb" role="img" aria-label="" />
        </>
      }
      passToggleToPop
    >
      <DeleteTeamPop {...props} />
    </PopoverWithButton>
  </section>
);

DeleteTeam.propTypes = {
  api: PropTypes.func,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  teamAdmins: PropTypes.array.isRequired,
};
DeleteTeam.defaultProps = {
  api: null,
};

export default DeleteTeam;
