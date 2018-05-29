import React from 'react';
import PropTypes from 'prop-types';

//import Project from '../../models/project';

import Loader from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';

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
      error: null,
    };
  }
  
  componentDidMount() {
    this.props.get().then(
      ({data}) => this.setState({
        maybeProject: data,
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
        ? <ProjectPage name={this.props.name} />
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
    get: () => application.api().get(`projects/${name}`),
    name,
  };
  const content = Reactlet(ProjectPageLoader, props, 'projectpage');
  return LayoutPresenter(application, content);
}
