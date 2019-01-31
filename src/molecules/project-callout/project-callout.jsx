import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './project-callout.css'
import Button from '../../atoms/button/button'

let cx = classNames.bind(styles);

/**
 * Button Component
 */
const ProjectCallout = ({ project }) => {
  return (
    <div className="project-callout">
      <Button onClick={onClick} type={type} size={size}>
        <a class="button-area" href=""><div class="project " data-track="project" data-track-label="famous-chipmunk-with-really-long-project-name"><div class="project-container"><img class="avatar" src="https://cdn.glitch.com/project-avatar/8ebe96ce-cfb0-49ea-9a7a-17b8d46764ce.png" alt="famous-chipmunk-with-really-long-project-name avatar"><div class="button"><span class="project-badge private-project-badge" aria-label="private"></span><div class="project-name">famous-chipmunk-with-really-long-project-name</div></div><div class="description" style="color: black;"><span class="markdown-content"><p>Your very own basic web page, ready for you to customize.</p>
</span></div><div class="overflow-mask"></div></div></div></a>
        {children}
        <img className="emoji" src={emoji}></img>
      </Button>
    </div>
  )
}

ButtonWithEmoji.propTypes = {
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.string,
  /** full url for emoji image */
  emoji: PropTypes.string.isRequired
};

export default ButtonWithEmoji