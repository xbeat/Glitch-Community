import React from 'react';
import PropTypes from 'prop-types';

const ThanksRaw = ({children}) => (
  <p className="user-thanks">
    {children}
    &nbsp;
    <span className="emoji sparkling_heart" />
  </p>
);
ThanksRaw.propTypes = {
  children: PropTypes.node.isRequired,
};

const ThanksText = ({count}) => {
  if (count === 1) {
    return "Thanked once";
  } else if (count === 2) {
    return "Thanked twice";
  } 
  return `Thanked ${count} times`;
}
ThanksText.propTypes = {
  count: PropTypes.number.isRe

export const ThanksShort = ({count}) => <ThanksRaw>{count}</ThanksRaw>;
ThanksShort.propTypes = {
  count: PropTypes.number.isRequired,
};

const Thanks = ({count}) => <ThanksRaw><ThanksText count={count} /></ThanksRaw>;
Thanks.propTypes = {
  count: PropTypes.number.isRequired,
};
export default Thanks;