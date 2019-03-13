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

const RawHTML = ({ children }) =>
  children ? (
    <span
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: children }} // eslint-disable-line react/no-danger
    />
  ) : null;
RawHTML.propTypes = {
  children: PropTypes.string.isRequired,
};

const Markdown = React.memo(({ children }) => {
  console.og(children)
  const rendered = md.render(children || '');
  console.log("rendere", rendered, typeof rendered)
  return <RawHTML>{rendered}</RawHTML>;
});
Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

export const TruncatedMarkdown = React.memo(({ children, length }) => {
  const rendered = md.render(children || '');
  const truncated = truncate(rendered, length, { ellipsis: '…' });
  return <RawHTML>{truncated}</RawHTML>;
});
TruncatedMarkdown.propTypes = {
  children: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
};

export default Markdown;
