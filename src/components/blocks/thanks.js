import React from 'react';
import PropTypes from 'prop-types';
import Emoji from 'Components/image/emoji';
import styles from './thanks.js'

const thanksText = (count) => {
  if (count === 1) {
    return 'Thanked once';
  }
  if (count === 2) {
    return 'Thanked twice';
  }
  return `Thanked ${count} times`;
};

const HeartEmoji = () => <span className="emoji sparkling_heart" />

const ThanksLong = ({ count }) => (
    <p className={styles.container}>
      {thanksText(count)}
      &nbsp;
      <HeartEmoji />
    </p>
  )

const ThanksShort = ({ count }) => (
  <p className={styles.container}>
    <HeartEmoji />
    &nbsp;
    {count}
  </p>
);

const Thanks = ({ count, short }) => {
  if (count <= 0) return null
  if (short) return <ThanksShort count={count} />
  return <ThanksLong count={count} />
}

Thanks.propTypes = {
  count: PropTypes.number.isRequired,
  short: PropTypes.bool,
};

Thanks.defaultProps = {
  short: false,
}

export default Thanks;
