import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {CurrentUserConsumer} from '../current-user.jsx';
import TeamEditor from '../team-editor.jsx';
import {getLink, getAvatarStyle, getProfileStyle} from '../../models/team';
import {AuthDescription} from '../includes/description-field.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';

import EditableField from '../includes/editable-field.jsx';
import Thanks from '../includes/thanks.jsx';
import NameConflictWarning from '../includes/name-conflict.jsx';
import AddTeamProject from '../includes/add-team-project.jsx';
import DeleteTeam from '../includes/delete-team.jsx';
import {AddTeamUser, TeamUsers, WhitelistedDomain, JoinTeam} from '../includes/team-users.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';

function syncPageToUrl(url) {
  history.replaceState(null, null, getLink({url}));
}

const TeamNameUrlFields = ({team, updateName, updateUrl}) => (
  <>
    <h1>
      <EditableField
        value={team.name}
        update={updateName}
        placeholder="What's its name?"
        suffix={team.isVerified ? <VerifiedBadge/> : null}
      />
    </h1>
    <p className="team-url">
      <EditableField
        value={team.url}
        update={url => updateUrl(url).then(() => syncPageToUrl(url))}
        placeholder="Short url?"
        prefix="@"
      />
    </p>
  </>
);

// Team Page

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.teamAdmins = this.teamAdmins.bind(this);
  }

  teamAdmins() {
    return this.props.team.users.filter(user => {
      return this.props.team.adminIds.includes(user.id);
    });
  }
  
  userCanJoinTeam() {
    const {currentUser, team} = this.props;
    if (!this.props.currentUserIsOnTeam && team.whitelistedDomain && currentUser && currentUser.emails) {
      return currentUser.emails.some(({email, verified}) => verified && email.endsWith(`@${team.whitelistedDomain}`));
    }
    return false;
  }

  render() {
    return (
      <main className="profile-page team-page">
        <section>
          { this.props.currentUserIsOnTeam && (
            <div className="beta">Teams Beta, <a href="/teams/" target="_blank" >Learn More</a></div>
          )}
          <ProfileContainer
            avatarStyle={getAvatarStyle({...this.props.team, cache: this.props.team._cacheAvatar})}
            coverStyle={getProfileStyle({...this.props.team, cache: this.props.team._cacheCover})}
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
            {this.props.currentUserIsTeamAdmin ? (
              <TeamNameUrlFields team={this.props.team} updateName={this.props.updateName} updateUrl={this.props.updateUrl}/>
            ) : (
              <>
                <h1>{this.props.team.name} {this.props.team.isVerified && <VerifiedBadge/>}</h1>
                <p className="team-url">@{this.props.team.url}</p>
              </>
            )}
            <div className="users-information">
              <TeamUsers 
                {...this.props}
                users={this.props.team.users}
                teamId={this.props.team.id}
                adminIds={this.props.team.adminIds}
              />
              { !!this.props.team.whitelistedDomain &&
                <WhitelistedDomain domain={this.props.team.whitelistedDomain}
                  setDomain={this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null}
                />
              }
              { this.props.currentUserIsOnTeam &&
                <AddTeamUser
                  inviteEmail={this.props.inviteEmail}
                  inviteUser={this.props.inviteUser}
                  setWhitelistedDomain={this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null}
                  members={this.props.team.users.map(({id}) => id)}
                  whitelistedDomain={this.props.team.whitelistedDomain}
                  api={this.props.api}
                />
              }
              { this.userCanJoinTeam() && <JoinTeam onClick={this.props.joinTeam}/> }
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
          api={this.props.api}
        />
        <EntityPageProjects
          projects={this.props.team.projects}
          pins={this.props.team.teamPins}
          isAuthorized={this.props.currentUserIsOnTeam}
          addPin={this.props.addPin}
          removePin={this.props.removePin}
          projectOptions={{
            removeProjectFromTeam: this.props.removeProject,
            joinTeamProject: this.props.joinTeamProject,
            leaveTeamProject: this.props.leaveTeamProject,
          }}
          api={this.props.api}
        />

        { (this.props.team.projects.length === 0 && this.props.currentUserIsOnTeam) &&
          <aside className="inline-banners add-project-to-empty-team-banner">
            <div className="description-container">
              <img className="project-pals" src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925" alt="" />
              <div className="description">Add projects to share them with your team</div>
            </div>
          </aside>
        }

        { this.props.currentUserIsOnTeam &&
          <TeamAnalytics
            api={this.props.api}
            id={this.props.team.id}
            currentUserIsOnTeam={this.props.currentUserIsOnTeam}
            projects={this.props.team.projects}
            addProject={this.props.addProject}
            myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
          />
        }

        {this.props.currentUserIsTeamAdmin && (
          <DeleteTeam api={() => this.props.api}
            teamId={this.props.team.id}
            teamName={this.props.team.name}
            teamAdmins={this.teamAdmins()}
            users={this.props.team.users}
          />
        )}

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
    whitelistedDomain: PropTypes.string,
  }),
  addPin: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  updateWhitelistedDomain: PropTypes.func.isRequired,
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
};

const teamConflictsWithUser = (team, currentUser) => {
  if (currentUser && currentUser.login) {
    return currentUser.login.toLowerCase() === team.url;
  }
  return false;
};

const TeamNameConflict = ({team}) => (
  <CurrentUserConsumer>
    {currentUser => (
      teamConflictsWithUser(team, currentUser) && <NameConflictWarning/>
    )}
  </CurrentUserConsumer>
);

const TeamPageEditor = ({api, initialTeam, children}) => (
  <TeamEditor api={api} initialTeam={initialTeam}>
    {(team, funcs, ...args) => (
      <ProjectsLoader api={api} projects={team.projects}>
        {(projects, reloadProjects) => {
          // Inject page specific changes to the editor
          // Mainly url updating and calls to reloadProjects
          
          const removeUserFromTeam = async (user, projectIds) => {
            await funcs.removeUserFromTeam(user, projectIds);
            reloadProjects(...projectIds);
          };
          
          const joinTeamProject = async (projectId) => {
            await funcs.joinTeamProject(projectId);
            reloadProjects(projectId);
          };
          
          const leaveTeamProject = async (projectId) => {
            await funcs.leaveTeamProject(projectId);
            reloadProjects(projectId);
          };
          
          return children({...team, projects}, {
            ...funcs,
            removeUserFromTeam,
            joinTeamProject,
            leaveTeamProject,
          }, ...args);
        }}
      </ProjectsLoader>
    )}
  </TeamEditor>
);

const TeamPageContainer = ({api, team, ...props}) => (
  <TeamPageEditor api={api} initialTeam={team}>
    {(team, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) => (
      <>
        <Helmet>
          <title>{team.name}</title>
        </Helmet>

        <CurrentUserConsumer>
          {currentUser => (
            <TeamPage api={api} team={team} {...funcs} currentUser={currentUser}
              currentUserIsOnTeam={currentUserIsOnTeam} currentUserIsTeamAdmin={currentUserIsTeamAdmin}
              {...props}
            />
          )}
        </CurrentUserConsumer>

        <TeamNameConflict team={team}/>
      </>
    )}
  </TeamPageEditor>
);

export default TeamPageContainer;
