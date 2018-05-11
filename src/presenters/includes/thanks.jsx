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

const ThanksShort = ({count}) => <ThanksRaw>{count}</ThanksRaw>;

ThanksShort.propTypes = {
  count: PropTypes.number.isRequired,
};

export default ThanksShort;

const Thanks = ({count}) => (
  <p className="user-thanks">
    {ThanksText(count)}
    &nbsp;
    <span className="emoji sparkling_heart" />
  </p>
);

Thanks.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Thanks;