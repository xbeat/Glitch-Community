import React from 'react';
import PropTypes from 'prop-types';

import { TrackClick } from '../analytics';
import TeamsList from '../teams-list';
import Button from '../../components/buttons/button';
import CoverContainer from '../../c
// Image Buttons

export const ImageButtons = ({ name, uploadImage, clearImage }) => (
  <div className="upload-image-buttons">
    {!!uploadImage && (
      <TrackClick name={`Upload ${name}`}>
        <Button size="small" type="tertiary" onClick={uploadImage}>
          Upload {name}
        </Button>
      </TrackClick>
    )}
    {!!clearImage && (
      <TrackClick name={`Clear ${name}`}>
        <Button size="small" type="tertiary" onClick={clearImage}>
          Clear {name}
        </Button>
      </TrackClick>
    )}
  </div>
);
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
};
ImageButtons.defaultProps = {
  uploadImage: null,
  clearImage: null,
};

// Project Info Container

export const ProjectInfoContainer = ({ style, children, buttons }) => (
  <>
    <div className="avatar-container">
      <div className="user-avatar" style={style} />
      {buttons}
    </div>
    <div className="profile-information">{children}</div>
  </>
);
ProjectInfoContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.element,
};
ProjectInfoContainer.defaultProps = {
  buttons: null,
};

// Info Container (generic)

export const InfoContainer = ({ children }) => <div className="profile-info">{children}</div>;
InfoContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

// Profile Container

export class ProfileContainer extends React.PureComponent {
  render() {
    const { avatarStyle, avatarButtons, coverStyle, coverButtons, children, teams } = this.props;
    return (
      <CoverContainer style={coverStyle} buttons={coverButtons}>
        <InfoContainer>
          <div className="avatar-container">
            <div className="user-avatar" style={avatarStyle} />
            {avatarButtons}
          </div>
          <div className="profile-information">{children}</div>
        </InfoContainer>
        {!!teams && !!teams.length && (
          <div className="teams-information">
            <TeamsList teams={teams} />
          </div>
        )}
      </CoverContainer>
    );
  }
}
