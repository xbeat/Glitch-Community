import React from 'react';
import PropTypes from 'prop-types';

const AdminOnlyBadge = ({...props}) => {
  return (
    <React.Fragment>
    { !props.currentUserIsTeamAdmin && 
      <div className="status-badge">
        <span className="status admin">Admins</span>
      </div> 
    }
  )
};

AdminOnlyBadge.propTypes = {
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
};

export default AdminOnlyBadge;
