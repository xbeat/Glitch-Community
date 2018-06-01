import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import {StaticDescription} from '../includes/description-field.jsx';
import {AvatarContainer, InfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, ReportButton} from '../includes/project-buttons.jsx';
import UsersList from '../users-list.jsx';

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
    <iframe title="embed" src={`https://glitch.com/embed/#!/embed/${domain}?path=README.md`}></iframe>
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

const ReadmeLoader = ({getReadme}) => (
  <DataLoader get={getReadme} error={() => 'oops!'}>
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
}) => (
  <article className="project-page">
    <section id="info">
      <InfoContainer>
        <AvatarContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>{domain} {project.private && <PrivateBadge domain={domain}/>}</h1>
          <UsersList users={users} />
          <StaticDescription description={description}/>
        </AvatarContainer>
      </InfoContainer>
    </section>
    <section id="buttons">
      <ProjectButtons domain={domain} isMember={userIsCurrentUser}/>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
    </section>
    <section id="feedback">
      <ReportButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
    <section id="readme">
      <ReadmeLoader getReadme={getReadme}/>
    </section>
  </article>
);
ProjectPage.propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectPageLoader = ({name, get, getReadme}) => (
  <DataLoader get={get} error={() => <NotFound name={name}/>}>
    {project => <ProjectPage project={project} getReadme={getReadme}/>}
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
    name,
  };
  const content = Reactlet(ProjectPageLoader, props, 'projectpage');
  return LayoutPresenter(application, content);
}
