import React from 'react';
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';

const md = markdownIt({
  breaks: true,
  linkify: true,
  typographer: true,
}).use(markdownEmoji);

const Markdown = ({children, ...props}) => (
  <span dangerouslySetInnerHTML={{__html: md.render(children)}} {...props}></span>
);
Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

export { Markdown };
export default Markdown;