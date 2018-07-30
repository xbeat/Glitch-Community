import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarStyle, getProfileStyle} from '../../models/team';
import TeamEditor from '../team-editor.jsx';
import NameConflictWarning from '../includes/name-conflict.jsx';

import AddTeamProject from '../includes/add-team-project.jsx';
import {AddTeamUser, TeamUsers} from '../includes/team-users.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';
import Thanks from '../includes/thanks.jsx';

const TeamPage = ({
  team: {
    id, name, description, users,
    projects, teamPins,
    isVerified, verifiedImage, verifiedTooltip,
    backgroundColor, hasAvatarImage,
    coverColor, hasCoverImage,
    _cacheAvatar, _cacheCover,
  },
  currentUserIsOnTeam,
  updateDescription,
  uploadAvatar, uploadCover, clearCover,
  addUser, removeUser,
  addPin, removePin,
  addProject, removeProject,
  api, searchUsers,
}) => (
  <main className="profile-page team-page">
    <section>
      <ProfileContainer
        avatarStyle={getAvatarStyle({id, hasAvatarImage, backgroundColor, cache: _cacheAvatar})}
        coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
        avatarButtons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}
        coverButtons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/> : null}
      >
        <h1 className="username">
          {name}
          {isVerified && <VerifiedBadge image={verifiedImage} tooltip={verifiedTooltip}/>}
        </h1>
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUser}}/>
          {currentUserIsOnTeam && <AddTeamUser search={searchUsers} add={addUser} members={users.map(({id}) => id)}/>}
        </div>
        <Thanks count={users.reduce((total, {thanksCount}) => total + thanksCount, 0)}/>
        <AuthDescription authorized={currentUserIsOnTeam} description={description} update={updateDescription} placeholder="Tell us about your team"/>
      </ProfileContainer>
    </section>
    <AddTeamProject {...{currentUserIsOnTeam, addProject}} teamProjects={projects}/>
    <EntityPageProjects
      api={api} projects={projects} pins={teamPins} isAuthorized={currentUserIsOnTeam}
      addPin={addPin} removePin={removePin} projectOptions={{removeProjectFromTeam: removeProject}}
    />
    {(currentUserIsOnTeam ?
      <TeamAnalytics api={() => api} id={id} currentUserOnTeam={currentUserIsOnTeam} projects={projects}/>
      : <TeamMarketing/>)}
  </main>
);
TeamPage.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  api: PropTypes.any.isRequired,
};

const teamConflictsWithUser = (team, currentUserModel) => {
  if (currentUserModel.login()) {
    return currentUserModel.login().toLowerCase() === team.url;
  }
  return false;
};

const TeamPageContainer = ({api, currentUserModel, team, ...props}) => (
  <TeamEditor api={api} currentUserModel={currentUserModel} initialTeam={team}>
    {(team, funcs, currentUserIsOnTeam) => (
      <React.Fragment>
        <TeamPage api={api} team={team} {...funcs} currentUserIsOnTeam={currentUserIsOnTeam} {...props}/>
        {teamConflictsWithUser(team, currentUserModel) && <NameConflictWarning/>}
      </React.Fragment>
    )}
  </TeamEditor>
);

export default TeamPageContainer;
