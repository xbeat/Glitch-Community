import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../../utils/assets';
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
import Uploader from '../includes/uploader.jsx';

import AddTeamProject from '../includes/add-team-project.jsx';
import DeleteTeam from '../includes/delete-team.jsx';
import {AddTeamUser, TeamUsers} from '../includes/team-users.jsx';
import EntityEditor from '../entity-editor.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';
import TeamUpgradeInfoBanner from '../includes/team-upgrade-info-banner.jsx';
import TeamProjectLimitReachedBanner from '../includes/team-project-limit-reached-banner.jsx';

const FREE_TEAM_PROJECTS_LIMIT = 5;


// Team Page

const TeamPage = ({
  team: {
    id, name, description, users,
    projects, teamPins,
    isVerified, verifiedImage, verifiedTooltip,
    backgroundColor, hasAvatarImage,
    coverColor, hasCoverImage, adminUsers,
    _cacheAvatar, _cacheCover,
  },
  currentUserIsOnTeam, myProjects,
  updateDescription,
  uploadAvatar, uploadCover, clearCover,
  addUser, removeUser,
  addPin, removePin,
  addProject, removeProject,
  currentUserIsTeamAdmin,
  teamHasUnlimitedProjects, currentUserId,
  api, searchUsers, getProjects,
}) => {

  const projectLimitIsReached = () => {
    if ((currentUserIsOnTeam && !teamHasUnlimitedProjects && projects.length) >= FREE_TEAM_PROJECTS_LIMIT) {
      return true;
    } return false;
  };
  
  const notifyAdminOnly = () => {
    notify.createPersistentNotification(<p>remixing admin only</p>, 'notifyAdminOnly')
  }
  
  return (
    <main className="profile-page team-page">
      <section>
        <ProfileContainer
          avatarStyle={getAvatarStyle({id, hasAvatarImage, backgroundColor, cache: _cacheAvatar})}
          coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
          avatarButtons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}
          coverButtons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/> : null}
        >
          <h1 className="username">
            { name }
            { isVerified && 
              <VerifiedBadge image={verifiedImage} tooltip={verifiedTooltip}/>
            }
          </h1>
          <div className="users-information">
            <TeamUsers {...{users, currentUserIsOnTeam, removeUser, adminUsers, api, teamId:id, currentUserIsTeamAdmin}} />
            { currentUserIsOnTeam && 
              <AddTeamUser search={searchUsers} add={addUser} members={users.map(({id}) => id)} />
            }
          </div>
          <Thanks count={users.reduce((total, {thanksCount}) => total + thanksCount, 0)} />
          <AuthDescription 
            authorized={currentUserIsOnTeam} 
            description={description} 
            update={updateDescription} 
            placeholder="Tell us about your team"
          />
        </ProfileContainer>
      </section>
      <AddTeamProject 
        {...{currentUserIsOnTeam, addProject, myProjects}} 
        teamProjects={projects}
        projectLimitIsReached={projectLimitIsReached()}
        api={() => api}
      />
      { projectLimitIsReached() &&
        <TeamProjectLimitReachedBanner 
          teamName={name} 
          teamId={id}
          currentUserId={currentUserId}
          users={users}
        />
      }
      <EntityPageProjects
        projects={projects} 
        pins={teamPins} 
        isAuthorized={currentUserIsOnTeam}
        addPin={addPin} 
        removePin={removePin} 
        projectOptions={{removeProjectFromTeam: removeProject}}
        getProjects={getProjects}
      />
      { currentUserIsOnTeam && 
        <TeamAnalytics 
          api={() => api} 
          id={id} 
          currentUserOnTeam={currentUserIsOnTeam} 
          projects={projects} 
          addProject={addProject} 
          myProjects={myProjects} 
        /> 
      }
      { (currentUserIsOnTeam && !teamHasUnlimitedProjects ) && 
        <TeamUpgradeInfoBanner 
          projectsCount={projects.length} 
          limit={FREE_TEAM_PROJECTS_LIMIT} 
          teamName={name} 
          teamId={id} 
          users={users} 
          currentUserId={currentUserId} 
        />
      }

      {/* billing info section goes here */}

      { currentUserIsOnTeam && 
        <DeleteTeam api={() => api} 
          teamId={id} 
          teamName={name} 
          adminUsers={adminUsers} 
          currentUserIsTeamAdmin={currentUserIsTeamAdmin} 
          users={users} /> 
      }
      { !currentUserIsOnTeam && 
        <TeamMarketing /> 
      }
    </main>
  );
};


// Team Page Loader

const TeamPageLoader = ({api, get, name, currentUserModel, ...props}) => (
  <Notifications>
    <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
      {team => team ? (
        <TeamEditor api={api} currentUserModel={currentUserModel} initialTeam={team}>
          {(team, funcs, currentUserIsOnTeam) => (
            <TeamPage api={api} team={team} {...funcs} currentUserIsOnTeam={currentUserIsOnTeam} {...props} />
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


// Init Team

const ParseTeam = (data) => {
  let ADMIN_ACCESS_LEVEL = 30;
  let adminUsers = data.users.filter(user => {
    return user.teamsUser.accessLevel === ADMIN_ACCESS_LEVEL;
  });
  data.adminUsers = adminUsers.map(user => {
    return user.id;
  });
  return data;
};

export default function(application, id, name) {
  const props = {
    name,
    api: application.api(),
    currentUserId: application.currentUser().id(),
    currentUserModel: application.currentUser(),
    myProjects: application.currentUser().projects().map(({asProps}) => asProps()),
    get: () => 
      application.api().get(`teams/${id}`)
        .then(({data}) => (
          data ? 
            TeamModel(ParseTeam(data)).update(data).asProps() 
            : null
        )),
    searchUsers: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(project => ProjectModel(project).update(project).asProps())),
  };
  const content = Reactlet(TeamPageLoader, props, 'teampage');
  return LayoutPresenter(application, content);
}
