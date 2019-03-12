import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownSanitizer from 'markdown-it-sanitizer';
import truncate from 'html-truncate';
import styles from './markdown.styl';

const cx = classNames.bind(styles);

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .disable('smartquotes')
  .use(markdownEmoji)
  .use(markdownSanitizer);

/**
 * Markdown Component
 */
const Markdown = ({ type, size, children, truncate }) => {
  const className = cx({
    'markdown-content': true,
    // cta: type === 'cta',
    // small: size === 'small',
    // tertiary: ['tertiary', 'dangerZone'].includes(type),
    // dangerZone: type === 'dangerZone',
  });
  let rendered = md.render(children || '');
  if (length > 0) {
  }
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }} // eslint-disable-line react/no-danger
    />
  );
};

Markdown.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** truncate Markdown after this length */
  length: PropTypes.number,
};

Markdown.defaultProps = {
  type: '',
  size: '',
  length: -1,
};

export default Markdown;
