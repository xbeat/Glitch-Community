import React from 'react';
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownSanitizer from 'markdown-it-sanitizer';
import truncate from 'html-truncate';
import styles from './markdown.styl';

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
const Markdown = ({ children, length }) => {
  let rendered = md.render(children || '');
  if (length > 0) {
    rendered = truncate(rendered, length, { ellipsis: '…' });
  }
  return (
    <span
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: rendered }} // eslint-disable-line react/no-danger
    />
  );
};

Markdown.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** length to truncate rendered Markdown to */
  length: PropTypes.number,
};

Markdown.defaultProps = {
  length: -1,
};

export default Markdown;
