import React from 'react';
import PropTypes from 'prop-types';
import styles from './segmented-buttons.styl';
import Button from '../buttons/button';

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
    this.props.onClick(index);
  }

  render() {
    const { buttons } = this.props;

    return (
      <div className={styles.segmentedButtons}>
        {buttons.map((button, index) => (
          <Button key={button.id} size="small" type="tertiary" active={index === this.state.activeFilter} onClick={() => this.setFilter(index)}>
            {button.contents}
          </Button>
        ))}
      </div>
    );
  }
}

SegmentedButtons.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SegmentedButtons;
