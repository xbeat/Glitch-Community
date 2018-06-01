import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';
import {Markdown} from './markdown.jsx';



export class ReadmeLoader extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return <Loader/>;
  }
}