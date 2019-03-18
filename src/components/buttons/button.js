import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './button.styl';
import { Link } from '../../presenters/includes/link';

const cx = classNames.bind(styles);

export const TYPES = ['tertiary', 'cta', 'dangerZone', 'link', 'dropDown'];
export const SIZES = ['small'];

/**
 * Button Component
 */

const Button = ({ onClick, href, disabled, type, size, opaque, hover, children }) => {
  const className = cx({
    btn: true,
    cta: type === 'cta',
    small: size === 'small',
    tertiary: ['tertiary', 'dangerZone'].includes(type),
    dangerZone: type === 'dangerZone',
    unstyled: ['link', 'dropDown'].includes(type),
    link: type === 'link', // style this button to look like a link
    hasEmoji: React.Children.count(children, (child) => child.type && (child.type.name === 'Emoji' || 'Image')) > 0,
    opaque,
    hover,
  });

  const linkOrButton = () => {
    if (onClick) {
      return (
        <button onClick={onClick} className={className} disabled={disabled}>
          {children}
        </button>
      );
    }
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  };

  return linkOrButton();
};

Button.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** callback when button clicked */
  onClick(props, propName) {
    if (props.href === false && (props[propName] === null || typeof props[propName] !== 'function')) {
      return new Error('Please provide a href or an onClick function');
    }
    return null;
  },
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
  /** whether or not the button's hover state should be active */
  hover: PropTypes.bool,
  /** whether or not the button takes on the colour of the background */
  transparent: PropTypes.bool,
  /** link when button clicked */
  href(props, propName) {
    if (props.onClick === false && (props[propName] === null || typeof props[propName] !== 'string')) {
      return new Error('Please provide a href or an onClick function');
    }
    return null;
  },
};

Button.defaultProps = {
  onClick: null,
  disabled: false,
  type: null,
  size: null,
  hover: false,
  transparent: false,
  href: null,
  emoji: null,
};

export default Button;
