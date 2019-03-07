import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { partition } from 'lodash';
import { getAvatarStyle, getLink, getProfileStyle } from '../../models/user';

import { AnalyticsContext } from '../analytics';
import { CurrentUserConsumer } from '../current-user';
import { AuthDescription } from '../includes/description-field';
import EditableField from '../includes/editable-field';
import UserEditor from '../user-editor';
import { Thanks } from '../includes/thanks';

import DeletedProjects from '../deleted-projects';
import EntityPageFeaturedProject from '../entity-page-featured-project';
import EntityPageProjects from '../entity-page-projects';
import CollectionsList from '../collections-list';
import { ProfileContainer, ImageButtons } from '../includes/profile';
import ProjectsLoader from '../projects-loader';
import ReportButton from '../pop-overs/report-abuse-pop';

function syncPageToLogin(login) {
  history.replaceState(null, null, getLink({ login }));
}

const NameAndLogin = ({ name, login, isAuthorized, updateName, updateLogin }) => {
  if (!login) {
    return <h1 className="login">Anonymous</h1>;
  }

  if (!isAuthorized) {
    if (!name) {
      return <h1 className="login">@{login}</h1>;
    }
    return (
      <>
        <h1 className="username">{name}</h1>
        <h2 className="login">@{login}</h2>
      </>
    );
  }
  const editableName = name !== null ? name : '';
  return (
    <>
      <h1 className="username">
        <EditableField value={editableName} update={updateName} placeholder="What's your name?" />
      </h1>
      <h2 className="login">
        <EditableField value={login} update={updateLogin} prefix="@" placeholder="Nickname?" />
      </h2>
    </>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func.isRequired,
  updateLogin: PropTypes.func.isRequired,
};

NameAndLogin.defaultProps = {
  name: '',
  login: '',
};

// has science gone too far?
const UserPage = ({
  user: {
    // has science gone too far?
    _deletedProjects,
    _cacheCover,
    featuredProjectId,
    ...user
  },
  api,
  isAuthorized,
  maybeCurrentUser,
  updateDescription,
  updateName,
  updateLogin,
  uploadCover,
  clearCover,
  uploadAvatar,
  addPin,
  removePin,
  leaveProject,
  deleteProject,
  undeleteProject,
  featureProject,
  unfeatureProject,
  setDeletedProjects,
  addProjectToCollection,
}) => {
  const pinnedSet = new Set(user.pins.map(({ projectId }) => projectId));
  // filter featuredProject out of both pinned & recent projects
  const [pinnedProjects, recentProjects] = partition(user.projects.filter(({ id }) => id !== featuredProjectId), ({ id }) => pinnedSet.has(id));
  const featuredProject = user.projects.find(({ id }) => id === featuredProjectId);

  return (
    <main className="profile-page user-page">
      <section>
        <ProfileContainer
          avatarStyle={getAvatarStyle(user)}
          coverStyle={getProfileStyle({ ...user, cache: _cacheCover })}
          coverButtons={
            isAuthorized &&
            !!user.login && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={user.hasCoverImage ? clearCover : null} />
          }
          avatarButtons={isAuthorized && !!user.login && <ImageButtons name="Avatar" uploadImage={uploadAvatar} />}
          teams={user.teams}
        >
          <NameAndLogin
            name={user.name}
            login={user.login}
            {...{ isAuthorized, updateName }}
            updateLogin={(login) => updateLogin(login).then(() => syncPageToLogin(login))}
          />
          {!!user.thanksCount && <Thanks count={user.thanksCount} />}
          <AuthDescription
            authorized={isAuthorized && !!user.login}
            description={user.description}
            update={updateDescription}
            placeholder="Tell us about yourself"
          />
        </ProfileContainer>
      </section>

      {featuredProject && (
        <EntityPageFeaturedProject
          featuredProject={featuredProject}
          api={api}
          isAuthorized={isAuthorized}
          unfeatureProject={unfeatureProject}
          addProjectToCollection={addProjectToCollection}
          currentUser={maybeCurrentUser}
        />
      )}

      {/* Pinned Projects */}
      <EntityPageProjects
        projects={pinnedProjects}
        isAuthorized={isAuthorized}
        api={api}
        removePin={removePin}
        projectOptions={{
          featureProject,
          leaveProject,
          deleteProject,
          addProjectToCollection,
        }}
        currentUser={maybeCurrentUser}
      />

      {!!user.login && (
        <CollectionsList
          title="Collections"
          collections={user.collections.map((collection) => ({
            ...collection,
            user,
          }))}
          api={api}
          isAuthorized={isAuthorized}
          maybeCurrentUser={maybeCurrentUser}
        />
      )}

      {/* Recent Projects */}
      <EntityPageProjects
        projects={recentProjects}
        isAuthorized={isAuthorized}
        api={api}
        addPin={addPin}
        projectOptions={{
          featureProject,
          leaveProject,
          deleteProject,
          addProjectToCollection,
        }}
        currentUser={maybeCurrentUser}
      />
      {isAuthorized && (
        <DeletedProjects api={api} setDeletedProjects={setDeletedProjects} deletedProjects={_deletedProjects} undelete={undeleteProject} />
      )}
      {!isAuthorized && <ReportButton reportedType="user" reportedModel={user} />}
    </main>
  );
};

UserPage.propTypes = {
  clearCover: PropTypes.func.isRequired,
  maybeCurrentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  leaveProject: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    id: PropTypes.number.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    pins: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    _deletedProjects: PropTypes.array.isRequired,
  }).isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  featureProject: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
};

const UserPageContainer = ({ api, user }) => (
  <AnalyticsContext properties={{ origin: 'user' }}>
    <UserEditor api={api} initialUser={user}>
      {(userFromEditor, funcs, isAuthorized) => (
        <>
          <Helmet>
            <title>{userFromEditor.name || (userFromEditor.login ? `@${userFromEditor.login}` : `User ${userFromEditor.id}`)}</title>
          </Helmet>

          <CurrentUserConsumer>
            {(maybeCurrentUser) => (
              <ProjectsLoader api={api} projects={userFromEditor.projects}>
                {(projects) => <UserPage {...{ api, isAuthorized, maybeCurrentUser }} user={{ ...userFromEditor, projects }} {...funcs} />}
              </ProjectsLoader>
            )}
          </CurrentUserConsumer>
        </>
      )}
    </UserEditor>
  </AnalyticsContext>
);

export default UserPageContainer;
