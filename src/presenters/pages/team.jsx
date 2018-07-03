import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../../utils/assets';
import TeamModel, {getAvatarStyle, getProfileStyle} from '../../models/team';
import UserModel from '../../models/user';
import ProjectModel from '../../models/project';
import Reactlet from '../reactlet';
import LayoutPresenter from '../layout';

import {AuthDescription} from '../includes/description-field.jsx';
import {DataLoader} from '../includes/loader.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import Thanks from '../includes/thanks.jsx';
import NotFound from '../includes/not-found.jsx';
import Uploader from '../includes/uploader.jsx';

import AddTeamProject from '../includes/add-team-project.jsx';
import {AddTeamUser, TeamUsers} from '../includes/team-users.jsx';
import EntityEditor from '../entity-editor.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';

const TeamPage = ({
  team: {
    id, name, description, users,
    projects, teamPins,
    isVerified, verifiedImage, verifiedTooltip,
    backgroundColor, hasAvatarImage,
    coverColor, hasCoverImage, adminUsers
  },
  currentUserIsOnTeam, myProjects,
  updateDescription,
  uploadAvatar, uploadCover, clearCover,
  addUser, removeUser,
  addPin, removePin,
  addProject, removeProject,
  api, searchUsers, getProjects,
  _cacheAvatar, _cacheCover,
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
          <TeamUsers {...{users, currentUserIsOnTeam, removeUser, adminUsers}}/>
          {currentUserIsOnTeam && <AddTeamUser search={searchUsers} add={addUser} members={users.map(({id}) => id)}/>}
        </div>
        <Thanks count={users.reduce((total, {thanksCount}) => total + thanksCount, 0)}/>
        <AuthDescription authorized={currentUserIsOnTeam} description={description} update={updateDescription} placeholder="Tell us about your team"/>
      </ProfileContainer>
    </section>
    <AddTeamProject {...{currentUserIsOnTeam, addProject, myProjects}} teamProjects={projects}/>
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

const NotificationContext = React.createContext({
  component: null,
  props: {},
  showNotification: () => {
    console.log ('showNotification triggered')
  },
  showNotification2: () => {}
});

class TeamPageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _cacheAvatar: Date.now(),
      _cacheCover: Date.now(),
    };
  }
  
  async uploadAvatar(blob) {
    try {
      const {id} = this.props.team;
      const {data: policy} = await assets.getTeamAvatarImagePolicy(this.props.api, id);
      await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        hasAvatarImage: true,
        backgroundColor: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({_cacheAvatar: Date.now()});
  }
  
  async uploadCover(blob) {
    try {
      const {id} = this.props.team;
      const {data: policy} = await assets.getTeamCoverImagePolicy(this.props.api, id);
      await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        hasCoverImage: true,
        coverColor: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({_cacheCover: Date.now()});
  }
  
  async removeUser(id) {
    await this.props.removeItem('users', id, 'users', {id});
    if (id === this.props.currentUserId) {
      const model = this.props.currentUserModel;
      model.teams(model.teams().filter(({id}) => id() !== this.props.team.id));
    }
  }
  
  render() {
    const {
      team,
      currentUserId,
      updateFields,
      addItem,
      removeItem,
      ...props
    } = this.props;
    const funcs = {
      currentUserIsOnTeam: team.users.some(({id}) => currentUserId === id),
      updateDescription: description => updateFields({description}),
      addUser: id => addItem('users', id, 'users', UserModel({id}).asProps()),
      removeUser: id => this.removeUser(id),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => updateFields({hasCoverImage: false}),
      addProject: id => addItem('projects', id, 'projects', ProjectModel({id}).asProps()),
      removeProject: id => removeItem('projects', id, 'projects', {id}),
      addPin: projectId => addItem('pinned-projects', projectId, 'teamPins', {projectId}),
      removePin: projectId => removeItem('pinned-projects', projectId, 'teamPins', {projectId}),
    };
    return <TeamPage team={team} {...this.state} {...funcs} {...props}/>;
  }
}
TeamPageEditor.propTypes = {
  currentUserId: PropTypes.number.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  updateFields: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

const TeamPageLoader = ({api, get, name, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
    {team => team ? (
      <EntityEditor api={api} initial={team} type="teams">
        {({entity, ...editFuncs}) => (
          <Uploader>
            {uploadFuncs => (
              <TeamPageEditor api={api} team={entity} {...editFuncs} {...uploadFuncs} {...props}/>
            )}
          </Uploader>
        )}
      </EntityEditor>
    ) : <NotFound name={name}/>}
  </DataLoader>
);
TeamPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  name: PropTypes.node.isRequired,
};

export default function(application, id, name) {
  const props = {
    name,
    api: application.api(),
    currentUserId: application.currentUser().id(),
    currentUserModel: application.currentUser(),
    myProjects: application.currentUser().projects().map(({asProps}) => asProps()),
    get: () => application.api().get(`teams/${id}`).then(({data}) => (data ? TeamModel(data).update(data).asProps() : null)),
    searchUsers: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
  };
  const content = Reactlet(TeamPageLoader, props, 'teampage');
  return LayoutPresenter(application, content);
}