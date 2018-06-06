import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';
import User from '../../models/user';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import {AvatarContainer, InfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, ReportButton} from '../includes/project-buttons.jsx';
import UsersList from '../users-list.jsx';
import RelatedProjects from '../includes/related-projects.jsx';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

const ProjectButtons = ({domain, isMember}) => (
  <React.Fragment>
    <ShowButton name={domain}/>
    <EditButton name={domain} isMember={isMember}/>
  </React.Fragment>
);
ProjectButtons.propTypes = {
  isMember: PropTypes.bool.isRequired,
};

const Embed = ({domain}) => (
  <div className="glitch-embed-wrap">
    <iframe title="embed" src={`https://glitch.com/embed/#!/embed/${domain}?path=README.md&previewSize=100`}></iframe>
  </div>
);
Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

const PrivateBadge = ({domain}) => {
  const tooltip = `Only members of ${domain} can see its code`;
  return <span className="private-project-badge" aria-label={tooltip} data-tooltip={tooltip}></span>;
};
PrivateBadge.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ReadmeError = (error) => (
  (error && error.response && error.response.status === 404)
    ? <React.Fragment>This project would be even better with a <code>README.md</code></React.Fragment>
    : <React.Fragment>We couldn't load the readme. Try refreshing?</React.Fragment>
);
const ReadmeLoader = ({getReadme}) => (
  <DataLoader get={getReadme} renderError={ReadmeError}>
    {readme => <Markdown>{readme}</Markdown>}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  getReadme: PropTypes.func.isRequired,
};

const ProjectPage = ({
  project: {
    avatar, description, domain, id,
    userIsCurrentUser, users,
    ...project // 'private' can't be used as a variable name
  },
  getReadme,
  getUsers,
  updateDescription,
}) => (
  <main className="project-page">
    <section id="info">
      <InfoContainer>
        <AvatarContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>{domain} {project.private && <PrivateBadge domain={domain}/>}</h1>
          <UsersList users={users} />
          <AuthDescription
            authorized={userIsCurrentUser} description={description}
            update={desc => updateDescription(id, desc)} placeholder="Tell us about your app"
          />
          <p id="buttons"><ProjectButtons domain={domain} isMember={userIsCurrentUser}/></p>
        </AvatarContainer>
      </InfoContainer>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
    </section>
    <section id="related">
      <RelatedProjects users={users} getUsers={getUsers}/>
    </section>
    <section id="readme">
      <ReadmeLoader getReadme={getReadme}/>
    </section>
    <section id="feedback">
      <ReportButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
  </main>
);
ProjectPage.propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectPageLoader = ({name, get, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
    {project => project ? <ProjectPage project={project} {...props}/> : <NotFound name={name}/>}
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

// Let's keep layout in jade until all pages are react
export default function(application, name) {
  const props = {
    get: () => application.api().get(`projects/${name}`).then(({data}) => (data ? Project(data).update(data).asProps() : null)),
    getReadme: () => application.api().get(`projects/${name}/readme`).then(({data}) => data),
    updateDescription: (id, description) => application.api().patch(`projects/${id}`, {description}),
    getUsers: (ids) => application.api().get(`users/byIds?ids=${ids}`).then(({data}) => User(data).update(data).asProps()),
    name,
  };
  const content = Reactlet(ProjectPageLoader, props, 'projectpage');
  return LayoutPresenter(application, content);
}
