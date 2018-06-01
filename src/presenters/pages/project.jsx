/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import Loader from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {StaticDescription} from '../includes/description-field.jsx';
import {AvatarContainer, InfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, RemixButton, FeedbackButton} from '../includes/project-buttons.jsx';
import UsersList from '../users-list.jsx';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

function trackRemix(domain, id) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}
const ProjectButtons = ({domain, id, isMember}) => (
  <React.Fragment>
    <ShowButton name={domain}/>
    <EditButton
      name={domain} isMember={isMember}
      className={isMember ? "button-cta" : null}
    />
    <RemixButton
      name={domain} isMember={isMember}
      className={isMember ? null : "button-cta"}
      onClick={() => trackRemix(domain, id)}
    />
  </React.Fragment>
);
ProjectButtons.propTypes = {
  id: PropTypes.string.isRequired,
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

const PrivateBadge = () => (
  <span className="private-project-badge" aria-label="private" data-tooltip="This project is private"></span>
);

const ProjectPage = ({
  project: {
    avatar, description, domain, id,
    userIsCurrentUser, users,
    ...project
  },
}) => (
  <article className="project-page">
    <section>
      <InfoContainer>
        <AvatarContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>{project.private && <PrivateBadge/>} {domain}</h1>
          <UsersList users={users} />
          <StaticDescription description={description}/>
        </AvatarContainer>
      </InfoContainer>
    </section>
    <section className="project-buttons">
      <ProjectButtons domain={domain} id={id} isMember={userIsCurrentUser}/>
    </section>
    <section>
      <Embed domain={domain}/>
    </section>
    <section className="feedback-buttons">
      <FeedbackButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
  </article>
);
ProjectPage.propTypes = {
  project: PropTypes.object.isRequired,
};

class ProjectPageLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeProject: null,
      loaded: false,
      error: null,
    };
  }
  
  componentDidMount() {
    this.props.get().then(
      project => this.setState({
        maybeProject: project,
        loaded: true,
      })
    ).catch(error => {
      console.error(error);
      this.setState({error});
    });
  }
  
  render() {
    return (this.state.loaded
      ? (this.state.maybeProject
        ? <ProjectPage project={this.state.maybeProject} />
        : <NotFound name={this.props.name} />)
      : <Loader />);
  }
}
ProjectPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

// Let's keep layout in jade until all pages are react
export default function(application, name) {
  const props = {
    get: () => application.api().get(`projects/${name}`).then(({data}) => (data ? Project(data).update(data).asProps() : null)),
    name,
  };
  const content = Reactlet(ProjectPageLoader, props, 'projectpage');
  return LayoutPresenter(application, content);
}
