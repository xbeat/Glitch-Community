import React from 'react';
import PropTypes from 'prop-types';

const ThanksText = ({ count }) => {
  if (count === 1) {
    return 'Thanked once';
  } if (count === 2) {
    return 'Thanked twice';
  }
  return `Thanked ${count} times`;
};
ThanksText.propTypes = {
  count: PropTypes.number.isRequired,
};

const Thanks = ({ count }) => (count > 0 ? (
  <p className="thanks">
    <ThanksText count={count} />
    &nbsp;
    <span className="emoji sparkling_heart" />
  </p>
) : null);
Thanks.propTypes = {
  count: PropTypes.number.isRequired,
};

const ThanksShort = ({ count }) => (
  <p className="thanks">
    <span className="emoji sparkling_heart" />
    &nbsp;
    {count}
  </p>
);
ThanksShort.propTypes = {
  count: PropTypes.number.isRequired,
};

export { Thanks, ThanksShort };
