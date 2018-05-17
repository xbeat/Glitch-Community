import React from 'react';
import PropTypes from 'prop-types';
import mdFactory from 'markdown-it';

const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true,
});

const Markdown = ({children, ...props}) => (
  <span {...props} dangerouslySetInnerHTML={{__html: md.render(children)}}></span>
);
Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

export { Markdown };
export default Markdown;