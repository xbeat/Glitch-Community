/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import {AvatarContainer, InfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, RemixButton, ReportButton} from '../includes/project-buttons.jsx';
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

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

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
    userIsCurrentUser, users, teams,
    ...project // 'private' can't be used as a variable name
  },
  getReadme,
  getTeamPins,
  getUserPins,
  getProjects,
  updateDomain,
  updateDescription,
}) => (
  <main className="project-page">
    <section id="info">
      <InfoContainer>
        <AvatarContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>
            {(userIsCurrentUser
              ? <EditableField value={domain} update={domain => updateDomain(id, domain)} placeholder="What's it called?"/>
              : domain
            )}
          </h1>
          <UsersList users={users} />
          <AuthDescription
            authorized={userIsCurrentUser} description={description}
            update={desc => updateDescription(id, desc)} placeholder="Tell us about your app"
          />
          <p className="buttons"><ProjectButtons domain={domain} isMember={userIsCurrentUser}/>{project.private && <PrivateBadge domain={domain}/>}</p>
        </AvatarContainer>
      </InfoContainer>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
      <div className="buttons buttons-right">
        <RemixButton className="button-small"
          name={domain} isMember={userIsCurrentUser}
          onClick={() => trackRemix(id, domain)}
        />
      </div>
    </section>
    <section id="related">
      <RelatedProjects ignoreProjectId={id} {...{teams, users, getTeamPins, getUserPins, getProjects}}/>
    </section>
    <section id="readme">
      <ReadmeLoader getReadme={getReadme}/>
    </section>
    <section id="feedback" className="buttons buttons-right">
      <ReportButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
  </main>
);
ProjectPage.propTypes = {
  project: PropTypes.object.isRequired,
};

class ProjectPageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.initialProject,
    };
  }
  
  render() {
    return <ProjectPage {...this.state} {...this.props}/>;
  }
}

const ProjectPageLoader = ({name, get, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
    {project => project ? <ProjectPageEditor initialProject={project} {...props}/> : <NotFound name={name}/>}
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

async function updateDomain(api, id, domain) {
  try {
    await api.patch(`projects/${id}`, {domain});
  } catch ({response: {data: {message}}}) {
    return {success: false, data: domain, message};
  }
  history.replaceState(null, null, `/~${domain}`);
  return {success: true, data: domain};
}

// Let's keep layout in jade until all pages are react
export default function(application, name) {
  const props = {
    get: () => application.api().get(`projects/${name}`).then(({data}) => (data ? Project(data).update(data).asProps() : null)),
    getReadme: () => application.api().get(`projects/${name}/readme`).then(({data}) => data),
    updateDomain: (id, domain) => updateDomain(application.api(), id, domain),
    updateDescription: (id, description) => application.api().patch(`projects/${id}`, {description}),
    getTeamPins: (id) => application.api().get(`teams/${id}/pinned-projects`).then(({data}) => data),
    getUserPins: (id) => application.api().get(`users/${id}/pinned-projects`).then(({data}) => data),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => Project(d).update(d).asProps())),
    name,
  };
  const content = Reactlet(ProjectPageLoader, props, 'projectpage');
  return LayoutPresenter(application, content);
}
