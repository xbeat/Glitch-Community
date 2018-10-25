import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from 'react-svg-inline';
import {defaultAvatarSVG} from '../../models/collection';

export default class CollectionAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  
  syncColor() {
    const svgBackgroundEl = this.ref.current;//.querySelector('.background');
    console.log(svgBackgroundEl);
    //svgBackgroundEl.setAttribute('fill', this.props.backgroundColor);
  }
  
  componentDidMount() {
    this.syncColor();
  }
  
  componentDidUpdate() {
    this.syncColor();
  }
  
  render() {
    return <SVGInline svg={defaultAvatarSVG} ref={this.ref}/>;
  }
}

CollectionAvatar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
};