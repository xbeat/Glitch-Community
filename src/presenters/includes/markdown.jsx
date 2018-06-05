import React from 'react';
import PropTypes from 'prop-types';
import truncate from 'html-truncate';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownSanitizer from 'markdown-it-sanitizer';

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .disable('smartquotes')
  .use(markdownEmoji)
  .use(markdownSanitizer);

const RawHTML = ({children}) => (
  children ? <span dangerouslySetInnerHTML={{__html: children}}></span> : null
);
RawHTML.propTypes = {
  children: PropTypes.string.isRequired,
};

const Markdown = ({children}) => (
  <RawHTML>{md.render(children)}</RawHTML>
);
Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

const TruncatedMarkdown = ({children, length}) => (
  <RawHTML>{truncate(md.render(children), length, {ellipsis: '…'})}</RawHTML>
);
TruncatedMarkdown.propTypes = {
  children: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
};

export { Markdown, TruncatedMarkdown };
export default Markdown;