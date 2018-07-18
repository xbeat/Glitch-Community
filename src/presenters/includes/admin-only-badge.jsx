import React from 'react';
import PropTypes from 'prop-types';

const AdminOnlyBadge = ({...props}) => {
  return (
    <React.Fragment>
      { !props.currentUserIsTeamAdmin && 
        <div className="status-badge">
          <span className="status admin">Admin</span>
        </div> 
      }
    </React.Fragment>
  )
};

AdminOnlyBadge.propTypes = {
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
};

export default AdminOnlyBadge;
