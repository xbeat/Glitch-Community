import React from 'react';
import PropTypes from 'prop-types';

import TeamModel, {getAvatarStyle, getProfileStyle} from '../../models/team';
import UserModel from '../../models/user';
import ProjectModel from '../../models/project';
import Reactlet from '../reactlet';
import LayoutPresenter from '../layout';
import TeamEditor from '../team-editor.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import {DataLoader} from '../includes/loader.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import Thanks from '../includes/thanks.jsx';
import NotFound from '../includes/not-found.jsx';
import {Notifications} from '../notifications.jsx';

import AddTeamProject from '../includes/add-team-project.jsx';
import {AddTeamUser, TeamUsers} from '../includes/team-users.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';

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
  api, searchUsers, getProjects,
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
      projects={projects} pins={teamPins} isAuthorized={currentUserIsOnTeam}
      addPin={addPin} removePin={removePin} projectOptions={{removeProjectFromTeam: removeProject}}
      getProjects={getProjects}
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

const TeamPageLoader = ({api, get, name, currentUserModel, ...props}) => (
  <Notifications>
    <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
      {team => team ? (
        <TeamEditor api={api} currentUserModel={currentUserModel} initialTeam={team}>
          {(team, funcs, currentUserIsOnTeam) => (
            <TeamPage api={api} team={team} {...funcs} currentUserIsOnTeam={currentUserIsOnTeam} {...props}/>
          )}
        </TeamEditor>
      ) : <NotFound name={name}/>}
    </DataLoader>
  </Notifications>
);
TeamPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  name: PropTypes.node.isRequired,
};

export default function(application, id, name) {
  const props = {
    name,
    api: application.api(),
    currentUserModel: application.currentUser(),
    get: () => application.api().get(`teams/${id}`).then(({data}) => (data ? TeamModel(data).update(data).asProps() : null)),
    searchUsers: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
  };
  const content = Reactlet(TeamPageLoader, props, 'teampage');
  return LayoutPresenter(application, content);
}