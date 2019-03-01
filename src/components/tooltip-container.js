import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './tooltip.styl';

const cx = classNames.bind(styles);

export const TYPES = ['action', 'information'];
export const ALIGNMENTS = ['left', 'right', 'center', 'top'];

function TooltipContainer({ id, type, tooltip, target, align, persistent, children }) {
  const [tooltipIsActive, setTooltipIsActive] = useState(false);

  const tooltipContainerClassName = cx({
    'tooltip-container': true,
  });

  const tooltipClassName = cx({
    tooltip: true,
    top: align.includes('top'),
    left: align.includes('left'),
    right: align.includes('right'),
    'new-stuff': id === 'new-stuff-tooltip',
    persistent,
  });

  let role;
  let extendedTarget;
  if (type === 'action') {
    // action tooltips are visible on hover and focus, click triggers a separate action
    // they should always be populated with their content, even when they are "hidden"

    role = 'tooltip';
    extendedTarget = React.cloneElement(target, {
      'aria-labelledby': id,
    });
  } else if (type === 'information') {
    // information tooltips are visible on hover and focus, they provide supplementary info
    // they should be empty when not "visible", and populated when they are

    role = 'status';
    extendedTarget = React.cloneElement(target, {
      'aria-describedby': id,
    });
  }

  const shouldShowTooltip = tooltip && (tooltipIsActive || persistent);

  return (
    <div className={tooltipContainerClassName}>
      <div
        onMouseEnter={() => setTooltipIsActive(true)}
        onMouseLeave={() => setTooltipIsActive(false)}
        onFocus={() => setTooltipIsActive(true)}
        onBlur={() => setTooltipIsActive(false)}
      >
        {extendedTarget}
      </div>
      <div role={role} id={id} className={tooltipClassName} style={{ opacity: shouldShowTooltip ? 1 : 0 }}>
        {type === 'information' || shouldShowTooltip ? tooltip : null}
      </div>
      {children}
    </div>
  );
}

// TODO multiple duplicate ids

TooltipContainer.propTypes = {
  children: PropTypes.node,
  /* the id of the tooltip */
  id: PropTypes.string.isRequired,
  /* the type of tooltip */
  type: PropTypes.oneOf(TYPES).isRequired,
  /* tooltip text */
  toolip: PropTypes.string,
  /* the focus/hover target of the tooltip */
  target: PropTypes.node.isRequired,
  /* how to align the tooltip */
  align: PropTypes.arrayOf(PropTypes.oneOf(ALIGNMENTS)),
  /* whether to persistently show the tooltip */
  persistent: PropTypes.bool,
};

TooltipContainer.defaultProps = {
  align: ['center'],
};

export default TooltipContainer;
