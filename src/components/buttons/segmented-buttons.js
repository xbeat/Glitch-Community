import React from 'react';
import PropTypes from 'prop-types';
import styles from './segmented-buttons.styl';
import Button from './button';

class SegmentedButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilter: this.props.buttons[0].name,
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(name) {
    this.setState({ activeFilter: name });
    // call the onclick event passed to the component
    this.props.onClick(name);
  }

  render() {
    const { buttons } = this.props;

    return (
      <div className={styles.segmentedButtons}>
        {buttons.map((button) => (
          <Button
            key={button.name}
            size="small"
            type="tertiary"
            active={button.name === this.state.activeFilter}
            onClick={() => this.setFilter(button.name)}
          >
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
      /** name: the filter name, passed back to onClick */
      name: PropTypes.string.isRequired,
      contents: PropTypes.node.isRequired,
    }),
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SegmentedButtons;
