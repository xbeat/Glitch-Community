/* global notify */

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
import UsersList from "../users-list.jsx";

const FREE_TEAM_PROJECTS_LIMIT = 5;


// Team Page

class TeamPage extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      // currentUserIsOnTeam: this.props.currentUserIsOnTeam,
      // currentUserIsTeamAdmin: this.props.currentUserIsTeamAdmin,
      // teamHasUnlimitedProjects: this.props.teamHasUnlimitedProjects
    };
  }

//   team: {
//     id, name, description, users,
//     projects, teamPins,
//     isVerified, verifiedImage, verifiedTooltip,
//     backgroundColor, hasAvatarImage,
//     coverColor, hasCoverImage, adminIds,
//     _cacheAvatar, _cacheCover,
//   },
//   currentUserIsOnTeam, myProjects,
//   updateDescription,
//   uploadAvatar, uploadCover, clearCover,
//   addUser, removeUser,
//   addPin, removePin,
//   addProject, removeProject,
//   currentUserIsTeamAdmin,
//   teamHasUnlimitedProjects, currentUserId,
//   api, searchUsers, getProjects,
// }) => {

  // create update state funcs to pass dowen
  
  projectLimitIsReached() {
    if ((this.state.currentUserIsOnTeam && !this.state.teamHasUnlimitedProjects && this.props.team.projects.length) >= FREE_TEAM_PROJECTS_LIMIT) {
      return true;
    } return false;
  };
  
  admins() {
    return this.props.team.users.filter(user => {
      return this.props.team.adminIds.includes(user.id);
    });
  }

  render() {
    return (
      <main className="profile-page team-page">
        <section>
          <ProfileContainer
            avatarStyle={getAvatarStyle({
              id: this.props.team.id, 
              hasAvatarImage: this.props.team.hasAvatarImage, 
              backgroundColor: this.props.team.backgroundColor, 
              cache: this.props.team._cacheAvatar,
            })}
            coverStyle={getProfileStyle({
              id: this.props.team.id, 
              hasCoverImage: this.props.team.hasCoverImage, 
              coverColor: this.props.team.coverColor, 
              cache: this.props.team._cacheCover,
            })}
            avatarButtons={this.props.currentUserIsTeamAdmin ? <ImageButtons name="Avatar" uploadImage={this.props.uploadAvatar} /> : null}
            coverButtons={this.props.currentUserIsTeamAdmin ? <ImageButtons name="Cover" 
                                                                uploadImage={uploadCover} 
                                                                clearImage={this.props.hasCoverImage ? clearCover : null} /> : null}
          >
            <h1 className="username">
              { name }
              { isVerified && 
                <VerifiedBadge image={verifiedImage} tooltip={verifiedTooltip}/>
              }
            </h1>
            <div className="users-information">
              <TeamUsers {...{users, currentUserIsOnTeam, removeUser, adminIds, api, teamId:id, currentUserIsTeamAdmin}} />
              { currentUserIsOnTeam && 
                <AddTeamUser search={searchUsers} add={addUser} members={users.map(({id}) => id)} />
              }
            </div>
            <Thanks count={users.reduce((total, {thanksCount}) => total + thanksCount, 0)} />
            <AuthDescription 
              authorized={currentUserIsTeamAdmin} 
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
        { (currentUserIsOnTeam && !teamHasUnlimitedProjects) && 
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

        {/* Temporary: enable once team creation is public
        { currentUserIsTeamAdmin && 
          <DeleteTeam api={() => api} 
            teamId={id} 
            teamName={name} 
            admins={admins}
            users={users} 
          /> 
        }
       */}

        { !currentUserIsOnTeam && 
          <TeamMarketing /> 
        }
      </main>
    );
  };
}

TeamPage.propTypes = {
  team: PropTypes.shape.isRequired({
    _cacheAvatar: PropTypes.number.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    features: PropTypes.array.isRequired,  
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
    teamPins: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    verifiedImage: PropTypes.string.isRequired,
    verifiedTooltip: PropTypes.string.isRequired,
  }),
  addPin: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  adminIds: PropTypes.array.isRequired,
  api: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  currentUserId: PropTypes.number.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  getProjects: PropTypes.func.isRequired,
  myProjects: PropTypes.array.isRequired,
  removeUser: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  teamHasUnlimitedProjects: PropTypes.bool.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
}






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
  let adminIds = data.users.filter(user => {
    return user.teamsUser.accessLevel === ADMIN_ACCESS_LEVEL;
  });
  data.adminIds = adminIds.map(user => {
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
