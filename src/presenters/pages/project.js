/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { getAvatarUrl } from '../../models/project';
import { getSingleItem } from '../../../shared/api';

import { AnalyticsContext } from '../analytics';
import TooltipContainer from '../../components/tooltips/tooltip-container';
import { DataLoader } from '../includes/loader';
import NotFound from '../includes/not-found';
import Markdown from '../includes/markdown';
import ProjectEditor from '../project-editor';
import Expander from '../includes/expander';
import EditableField from '../includes/editable-field';
import Embed from '../includes/embed';
import { AuthDescription } from '../includes/description-field';
import { InfoContainer, ProjectInfoContainer } from '../includes/profile';
import { ShowButton, EditButton, RemixButton } from '../includes/project-actions';
import ReportButton from '../pop-overs/report-abuse-pop';
import AddProjectToCollection from '../includes/add-project-to-collection';
import TeamsList from '../teams-list';
import UsersList from '../users-list';
import RelatedProjects from '../includes/related-projects';
import { addBreadcrumb } from '../../utils/sentry';

import { CurrentUserConsumer } from '../current-user';

import Layout from '../layout';

function trackRemix(id, domain) {
  analytics.track('Click Remix', {
    origin: 'project page',
    baseProjectId: id,
    baseDomain: domain,
  });
}

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const PrivateTooltip = 'Only members can view code';
const PublicTooltip = 'Visible to everyone';

const PrivateBadge = () => (
  <TooltipContainer
    type="info"
    id="private-project-badge-tooltip"
    tooltip={PrivateTooltip}
    target={<span className="project-badge private-project-badge" />}
  />
);

const PrivateToggle = ({ isPrivate, setPrivate }) => {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = 'button-tertiary button-on-secondary-background project-badge';
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';

  return (
    <TooltipContainer
      type="action"
      id="toggle-private-button-tooltip"
      target={<button onClick={() => setPrivate(!isPrivate)} className={`${classBase} ${className}`} type="button" />}
      tooltip={tooltip}
    />
  );
};
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
};

const ReadmeError = error => (error && error.response && error.response.status === 404 ? (
  <>
      This project would be even better with a <code>README.md</code>
  </>
) : (
  <>We couldn{"'"}t load the readme. Try refreshing?</>
));
const ReadmeLoader = ({ api, domain }) => (
  <DataLoader get={() => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({ data }) => (
      <Expander height={250}>
        <Markdown>{data.toString()}</Markdown>
      </Expander>
    )}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  api: PropTypes.any,
  domain: PropTypes.string.isRequired,
};
ReadmeLoader.defaultProps = {
  api: null,
};

const ProjectPage = ({
  project, addProjectToCollection, api, currentUser, isAuthorized, updateDomain, updateDescription, updatePrivate,
}) => {
  const { domain, users, teams } = project;
  return (
    <main className="project-page">
      <section id="info">
        <InfoContainer>
          <ProjectInfoContainer style={{ backgroundImage: `url('${getAvatarUrl(project.id)}')` }}>
            <h1>
              {isAuthorized ? (
                <EditableField
                  value={domain}
                  placeholder="Name your project"
                  update={newDomain => updateDomain(newDomain).then(() => syncPageToDomain(newDomain))}
                  suffix={<PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate} />}
                />
              ) : (
                <>
                  {domain} {project.private && <PrivateBadge />}
                </>
              )}
            </h1>
            <div className="users-information">
              <UsersList users={users} />
              {!!teams.length && <TeamsList teams={teams} />}
            </div>
            <AuthDescription
              authorized={isAuthorized}
              description={project.description}
              update={updateDescription}
              placeholder="Tell us about your app"
            />
            <p className="buttons">
              <ShowButton name={domain} />
              <EditButton name={domain} isMember={isAuthorized} />
            </p>
          </ProjectInfoContainer>
        </InfoContainer>
      </section>
      <section id="embed">
        <Embed domain={domain} />
        <div className="buttons space-between">
          <ReportButton reportedType="project" reportedModel={project} />
          <div>
            {currentUser.login && (
              <AddProjectToCollection
                className="button-small margin"
                api={api}
                currentUser={currentUser}
                project={project}
                fromProject
                addProjectToCollection={addProjectToCollection}
              />
            )}
            <RemixButton className="button-small margin" name={domain} isMember={isAuthorized} onClick={() => trackRemix(project.id, domain)} />
          </div>
        </div>
      </section>
      <section id="readme">
        <ReadmeLoader api={api} domain={domain} />
      </section>
      <section id="related">
        <RelatedProjects ignoreProjectId={project.id} {...{ api, teams, users }} />
      </section>
    </main>
  );
};
ProjectPage.propTypes = {
  api: PropTypes.any,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
};

ProjectPage.defaultProps = {
  api: null,
};

async function getProject(api, domain) {
  const project = await getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain)
 addBreadcrumb({
    level: 'info',
    message: `project: ${JSON.stringify(project)}`,
  });
  return dproject
}

const ProjectPageLoader = ({
  domain, api, currentUser, ...props
}) => (
  <DataLoader get={() => getProject(api, domain)} renderError={() => <NotFound name={domain} />}>
    {project => (project ? (
      <ProjectEditor api={api} initialProject={project}>
        {(currentProject, funcs, userIsMember) => (
          <>
            <Helmet>
              <title>{currentProject.domain}</title>
            </Helmet>
            <ProjectPage api={api} project={currentProject} {...funcs} isAuthorized={userIsMember} currentUser={currentUser} {...props} />
          </>
        )}
      </ProjectEditor>
    ) : (
      <NotFound name={domain} />
    ))
    }
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  api: PropTypes.func,
  domain: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

ProjectPageLoader.defaultProps = {
  api: null,
};

const ProjectPageContainer = ({ api, name }) => (
  <Layout api={api}>
    <AnalyticsContext properties={{ origin: 'project' }}>
      <CurrentUserConsumer>{currentUser => <ProjectPageLoader api={api} domain={name} currentUser={currentUser} />}</CurrentUserConsumer>
    </AnalyticsContext>
  </Layout>
);

export default ProjectPageContainer;
/