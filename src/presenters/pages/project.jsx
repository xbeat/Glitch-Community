import React from 'react';
import PropTypes from 'prop-types';

//import Project from '../../models/project';

import Loader from '../includes/loader.jsx';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

const ProjectPage = ({name}) => (
  <React.Fragment>{name}</React.Fragment>
);
ProjectPage.propTypes = {
  name: PropTypes.string.isRequired,
};

class ProjectPageLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeProject: null,
      loaded: false,
    };
  }
  
  componentDidMount() {
    application.api().get(`projects/${name}`)
    .then(function({data}) {
      if (!data) {
        //const project = Project({domain: name});
        //project.projectNotFound(true);
        return;
      }

      //return Project(data).showOverlay(application);
    }).catch(error => console.error("getProjectOverlay", error));
  }
  
  render() {
    return this.state.loaded ? <ProjectPage name={this.props.name} /> : <Loader />;
  }
}
ProjectPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

// Let's keep layout in jade until all pages are react
export default function(application, name) {
  application.api().get(`projects/${name}`)
    .then(function({data}) {
      if (!data) {
        //const project = Project({domain: name});
        //project.projectNotFound(true);
        return;
      }

      //return Project(data).showOverlay(application);
    }).catch(error => console.error("getProjectOverlay", error));
  const props = {
    name,
    
  const content = Reactlet(ProjectPageLoader, {name}, 'projectpage');
  return LayoutPresenter(application, content);
}
