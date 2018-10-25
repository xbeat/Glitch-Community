import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from 'react-svg-inline';

export default class Avatar extends React.Component{
  componentDidUpdate(){
    let svgBackgroundEl = document.querySelector('svg .background');
    svgBackgroundEl.setAttribute('fill', this.props.backgroundColor);
  }
  
  componentDidMount(){
    let svgBackgroundEl = document.querySelector('svg .background');
    svgBackgroundEl.setAttribute('fill', this.props.backgroundColor);
  }
  
  render(){
    return(
      <SVGInline svg={defaultAvatarSVG}/>
    );
  }
}