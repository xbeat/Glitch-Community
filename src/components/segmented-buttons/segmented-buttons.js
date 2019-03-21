import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './segmented-buttons.styl';
import Button from '../../buttons/button';

const cx = classNames.bind(styles);

const className = cx({
  'segmented-buttons': true,
});

class SegmentedButtons extends React.Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {
      activeFilter: this.props.buttons[0],
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(event) {
    console.log(event); 
    // this.setState({ activeFilter: filter });
  }

  render() {
    const { buttons, onClick } = this.props;
    const { setFilter } = this.state;

    return (
      <div className={className}>
        {buttons.map((button) => (
          <Button size="small" type="tertiary" active={button.active} onClick={(event) => setFilter}>
            {button.contents}
          </Button>
        ))}
      </div>
    );
  }
}

SegmentedButtons.propTypes = {
  /** Expected button format: [content: String, active: true/false]*/
  buttons: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

SegmentedButtons.defaultProps = {
  onClick: () => {},
  buttons: [],
};

export default SegmentedButtons;
