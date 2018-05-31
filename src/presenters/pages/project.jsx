/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import Loader from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {AvatarContainer, InfoContainer} from '../includes/profile.jsx';
import {PreviewButton, EditButton, RemixButton, FeedbackButton} from '../includes/project-buttons.jsx';
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

const Embed = ({domain}) => (
  <div className="glitch-embed-wrap" style={{height: '500px', width: '100%',}}>
    <iframe
      title="embed" style={{height: '100%', width: '100%', border: '0',}}
      src={`https://glitch.com/embed/#!/embed/${domain}?path=README.md`}
    ></iframe>
  </div>
);
Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ProjectPage = ({
  project: {
    avatar, description, domain, id,
    userIsCurrentUser, users,
  },
}) => (
  <article className="project-page">
    <section>
      <InfoContainer>
        <AvatarContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>{domain}</h1>
          <UsersList users={users} />
          <p>{description}</p>
        </AvatarContainer>
      </InfoContainer>
    </section>
    <section className="project-buttons">
      <PreviewButton name={domain}/>
      <EditButton
        name={domain} isMember={userIsCurrentUser}
        className={userIsCurrentUser ? "button-cta" : null}
      />
      <RemixButton
        name={domain} isMember={userIsCurrentUser}
        className={userIsCurrentUser ? null : "button-cta"}
        onClick={() => trackRemix(domain, id)}
      />
    </section>
    <section>
      <Embed domain={domain}/>
    </section>
    <div className="feedback-buttons">
      <FeedbackButton name={domain} id={id}/>
    </div>
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
