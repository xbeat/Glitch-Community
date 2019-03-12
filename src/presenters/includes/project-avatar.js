import React from 'react';
import PropTypes from 'prop-types';

import { FALLBACK_AVATAR_URL, getAvatarUrl } from '../../models/project';

const ProjectAvatar = ({ domain, id }) => (
  <img
    className="avatar"
    src={getAvatarUrl(id)}
    alt={`Project avatar for ${domain}`}
    onError={(event) => {
      event.target.src = FALLBACK_AVATAR_URL;
    }}
  />
);

ProjectAvatar.propTypes = {
  domain: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ProjectAvatar;
