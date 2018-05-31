import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import Loader from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {PreviewButton, EditButton, RemixButton, FeedbackButton} from '../includes/project-buttons.jsx';
import UsersList from '../users-list.jsx';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

const Embed = ({domain}) => (
  <div className="glitch-embed-wrap" style={{height: '400px', width: '100%',}}>
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
  <article>
    <section>
      <img className="avatar" src={avatar} alt="" />
      <h1>{domain}</h1>
      <UsersList users={users} />
      <p>{description}</p>
    </section>
    <section>
      <PreviewButton name={domain}/>{' '}
      <EditButton name={domain} isMember={userIsCurrentUser}/>{' '}
      <RemixButton name={domain} isMember={userIsCurrentUser} className="button-cta"/>
      <Embed domain={domain}/>
      <FeedbackButton name={domain} id={id}/>
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
