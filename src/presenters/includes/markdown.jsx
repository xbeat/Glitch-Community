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
  children ? <span className="markdown-content" dangerouslySetInnerHTML={{__html: children}}></span> : null
);
RawHTML.propTypes = {
  children: PropTypes.string.isRequired,
};

class Markdown extends React.PureComponent {
  render() {
    const {children} = this.props;
    const rendered = md.render(children || '');
    return <RawHTML>{rendered}</RawHTML>;
  }
}
Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

class TruncatedMarkdown extends React.PureComponent {
  render () {
    const {children, length} = this.props;
    const rendered = md.render(children || '');
    const truncated = truncate(rendered, length, {ellipsis: '…'});
    return <RawHTML>{truncated}</RawHTML>;
  }
}
TruncatedMarkdown.propTypes = {
  children: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
};

export { Markdown, TruncatedMarkdown };
export default Markdown;