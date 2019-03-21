import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './segmented-buttons.styl';
import Button from '../buttons/button';

const cx = classNames.bind(styles);

const className = cx({
  'segmented-buttons': true,
});

class SegmentedButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilter: 0,
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(index) {
    this.setState({ activeFilter: index });
    // call the onclick event passed to the component
    if (this.props.onClick) this.props.onClick(index);
  }

  render() {
    const { buttons } = this.props;

    return (
      <div className={className}>
        {buttons.map((button, index) => (
          <Button key={button.content} size="small" type="tertiary" active={index === this.state.activeFilter} onClick={() => this.setFilter(index)}>
            {button.contents}
          </Button>
        ))}
      </div>
    );
  }
}

SegmentedButtons.propTypes = {
  /** Expected button format: [content: ButtonName] */
  buttons: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

SegmentedButtons.defaultProps = {
  onClick: () => {},
};

export default SegmentedButtons;
