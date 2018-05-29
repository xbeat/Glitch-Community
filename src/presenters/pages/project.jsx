import React from 'react';
import PropTypes from 'prop-types';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

const ProjectPage = ({name}) => (
  <React.Fragment>{name}</React.Fragment>
);
ProjectPage.propTypes = {
  name: PropTypes.string.isRequired,
};

// Let's keep layout in jade until all pages are react
export default function(application, name) {
  const content = Reactlet(ProjectPage, {name}, 'projectpage');
  return LayoutPresenter(application, content);
}
