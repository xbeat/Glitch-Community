import React from 'react';
import PropTypes from 'prop-types';

const ThanksWrap = ({children}) => (
  <p className="thanks">
    {children}
    &nbsp;
    <span className="emoji sparkling_heart" />
  </p>
);
ThanksWrap.propTypes = {
  children: PropTypes.node.isRequired,
};

const ThanksText = ({count}) => {
  if (count === 1) {
    return "Thanked once";
  } else if (count === 2) {
    return "Thanked twice";
  } 
  return `Thanked ${count} times`;
};
ThanksText.propTypes = {
  count: PropTypes.number.isRequired,
};

const Thanks = ({count}) => (count > 0 ? <ThanksWrap><ThanksText count={count} /></ThanksWrap> : null);
Thanks.propTypes = {
  count: PropTypes.number.isRequired,
};

const ThanksShort = ({count}) => (count > 0 ? <ThanksWrap>{count}</ThanksWrap> : null);
ThanksShort.propTypes = {
  count: PropTypes.number.isRequired,
};

export {Thanks, ThanksShort};
export default Thanks;