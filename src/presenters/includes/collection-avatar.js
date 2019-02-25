import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from 'react-svg-inline';
import { defaultAvatarSVG } from '../../models/collection';

/* eslint-disable no-bitwise */
// from https://stackoverflow.com/a/21648508/1720985
const hexToRgbA = (hex) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return (
      `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.5)`
    );
  }
  return false;
};
/* eslint-enable no-bitwise */

export default class CollectionAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.syncColor();
  }

  componentDidUpdate() {
    this.syncColor();
  }

  syncColor() {
    const svgBackgroundEl = this.ref.current.querySelector('.background');
    svgBackgroundEl.setAttribute('fill', hexToRgbA(this.props.color));
  }

  render() {
    return (
      <span ref={this.ref}>
        <SVGInline svg={defaultAvatarSVG} />
      </span>
    );
  }
}

CollectionAvatar.propTypes = {
  color: PropTypes.string.isRequired,
};
