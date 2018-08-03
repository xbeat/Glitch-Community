import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import TeamEditor from '../team-editor.jsx';
import {getAvatarStyle, getProfileStyle} from '../../models/team';
import {AuthDescription} from '../includes/description-field.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';

import Thanks from '../includes/thanks.jsx';
import NameConflictWarning from '../includes/name-conflict.jsx';
import AddTeamProject from '../includes/add-team-project.jsx';
// import DeleteTeam from '../includes/delete-team.jsx';
import {AddTeamUser, TeamUsers} from '../includes/team-users.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';
import TeamUpgradeInfoBanner from '../includes/team-upgrade-info-banner.jsx';
import TeamProjectLimitReachedBanner from '../includes/team-project-limit-reached-banner.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

const FREE_TEAM_PROJECTS_LIMIT = 5;
const ADD_PROJECT_PALS = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fadd-projects-pals.svg?1533137032374";

// Team Page

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.teamAdmins = this.teamAdmins.bind(this);
  }

  projectLimitIsReached() {
    if ((this.props.currentUserIsOnTeam && !this.props.teamHasUnlimitedProjects && this.props.team.projects.length) >= FREE_TEAM_PROJECTS_LIMIT) {
      return true;
    }
    return false;

  }

  teamAdmins() {
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
            avatarButtons={this.props.currentUserIsTeamAdmin ? 
              <ImageButtons name="Avatar" uploadImage={this.props.uploadAvatar} /> 
              : null
            }
            coverButtons={this.props.currentUserIsTeamAdmin ? 
              <ImageButtons name="Cover"
                uploadImage={this.props.uploadCover}
                clearImage={this.props.team.hasCoverImage ? 
                  this.props.clearCover : null
                }
              /> : null
            }>
            <h1>
              { this.props.team.name }
              { this.props.team.isVerified &&
                <VerifiedBadge image={this.props.team.verifiedImage} tooltip={this.props.team.verifiedTooltip}/>
              }
            </h1>
            <div className="users-information">
              <TeamUsers {...this.props}
                users={this.props.team.users}
                teamId={this.props.team.id}
                adminIds={this.props.team.adminIds}
              />
              { this.props.currentUserIsOnTeam &&
                <AddTeamUser
                  add={this.props.addUser}
                  members={this.props.team.users.map(({id}) => id)}
                  api={this.props.api}
                />
              }
            </div>
            <Thanks count={this.props.team.users.reduce((total, {thanksCount}) => total + thanksCount, 0)} />
            <AuthDescription
              authorized={this.props.currentUserIsTeamAdmin}
              description={this.props.team.description}
              update={this.props.updateDescription}
              placeholder="Tell us about your team"
            />
          </ProfileContainer>
        </section>

        <AddTeamProject
          {...this.props}
          teamProjects={this.props.team.projects}
          projectLimitIsReached={this.projectLimitIsReached()}
          api={() => this.props.api}
          myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
        />
        { this.projectLimitIsReached() &&
          <TeamProjectLimitReachedBanner
            teamName={this.props.team.name}
            teamId={this.props.team.id}
            currentUserId={this.props.currentUser.id}
            users={this.props.team.users}
          />
        }
        <EntityPageProjects
          projects={this.props.team.projects}
          pins={this.props.team.teamPins}
          isAuthorized={this.props.currentUserIsOnTeam}
          addPin={this.props.addPin}
          removePin={this.props.removePin}
          projectOptions={{removeProjectFromTeam: this.props.removeProject}}
          api={this.props.api}
        />

        { (this.props.team.projects.length === 0 && this.props.currentUserIsOnTeam) &&
          <aside className="inline-banners add-project-to-empty-team-banner">
            <div className="description-container">
              <img className="project-pals" src={ADD_PROJECT_PALS} alt="" />
              <div className="description">Add projects to build your team</div>
            </div>
            <AddTeamProject
              {...this.props}
              extraButtonClass = "button-small"
              teamProjects = {this.props.team.projects}
              api={() => this.props.api}
              myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
            />
          </aside>
        }

        { this.props.currentUserIsOnTeam &&
          <TeamAnalytics
            api={() => this.props.api}
            id={this.props.team.id}
            currentUserIsOnTeam={this.props.currentUserIsOnTeam}
            projects={this.props.team.projects}
            addProject={this.props.addProject}
            myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
            projectLimitIsReached={this.projectLimitIsReached()}
          />
        }
        { (this.props.currentUserIsOnTeam && !this.props.teamHasUnlimitedProjects) &&
          <TeamUpgradeInfoBanner
            projectsCount={this.props.team.projects.length}
            limit={FREE_TEAM_PROJECTS_LIMIT}
            teamName={this.props.team.name}
            teamId={this.props.team.id}
            users={this.props.team.users}
            currentUserId={this.props.currentUser.id}
          />
        }

        {/* billing info section goes here */}

        {/* Temporary: enable once team creation is public
        { currentUserIsTeamAdmin &&
          <DeleteTeam api={() => this.props.api}
            teamId={this.props.team.id}
            teamName={this.props.team.name}
            teamAdmins={this.teamAdmins}
            users={this.props.team.users}
          />
        }
       */}

        { !this.props.currentUserIsOnTeam &&
          <TeamMarketing />
        }
      </main>
    );
  }
}

TeamPage.propTypes = {
  team: PropTypes.shape({
    _cacheAvatar: PropTypes.number.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    features: PropTypes.array.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
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
  api: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  removeUser: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  teamHasUnlimitedProjects: PropTypes.bool.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
};


const teamConflictsWithUser = (team, currentUserModel) => {
  if (currentUserModel.login()) {
    return currentUserModel.login().toLowerCase() === team.url;
  }
  return false;
};

const TeamPageContainer = ({api, currentUserModel, team, ...props}) => (
  <TeamEditor api={api} currentUserModel={currentUserModel} initialTeam={team}>
    {(team, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) => (
      <React.Fragment>
        <Helmet>
          <title>{team.name}</title>
        </Helmet>

        <CurrentUserConsumer>
          {currentUser => (
            <TeamPage api={api} team={team} {...funcs} currentUser={currentUser} currentUserIsOnTeam={currentUserIsOnTeam} currentUserIsTeamAdmin={currentUserIsTeamAdmin} {...props}/>
          )}
        </CurrentUserConsumer>

        {teamConflictsWithUser(team, currentUserModel) && <NameConflictWarning/>}
      </React.Fragment>
    )}
  </TeamEditor>
);

export default TeamPageContainer;
