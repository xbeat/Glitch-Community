import React from 'react';
import PropTypes from 'prop-types';
import truncate from 'html-truncate';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownSanitizer from 'markdown-it-sanitizer';
import markdownCheckbox from 'markdown-it-checkbox';

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .disable('smartquotes')
  .use(markdownEmoji)
  .use(markdownCheckbox)
  .use(markdownSanitizer);


const RawHTML = ({children}) => (
  children ? <span className="markdown-content" dangerouslySetInnerHTML={{__html: children}}></span> : null
);
RawHTML.propTypes = {
  children: PropTypes.string.isRequired,
};

const Markdown = ({children}) => (
  <React.Fragment>
    <RawHTML>{md.render(`Hijacked 'yer markdown for checkboxes! **win**
h1
--
let's test some checkboxes.

[ ] unchecked
[x] checked

There they are.

`)}</RawHTML>
        { <RawHTML>{md.render(children || '')}</RawHTML>}
  </React.Fragment>
);
Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

const TruncatedMarkdown = ({children, length}) => (
  <RawHTML>{truncate(md.render(children || ''), length, {ellipsis: '…'})}</RawHTML>
);
TruncatedMarkdown.propTypes = {
  children: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
};

export { Markdown, TruncatedMarkdown };
export default Markdown;