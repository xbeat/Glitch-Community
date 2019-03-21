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
    console.log('props', props);
    this.state = {
      activeFilter: 0,
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(index) {
    console.log('index');
    this.setState({ activeFilter: index });
    
    // call the onclick event passed to the component
    this.props.onClick(index);
  }

  render() {
    const { buttons, onClick } = this.props;
    const { setFilter } = this.state;

    return (
      <div className={className}>
        {buttons.map((button, index) => (
          <Button key={index} size="small" type="tertiary" active={index === this.state.activeFilter} onClick={() => this.setFilter(index)}>
            {button.contents}
          </Button>
        ))}
      </div>
    );
  }
}

SegmentedButtons.propTypes = {
  /** Expected button format: [content: ButtonName]*/
  buttons: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

SegmentedButtons.defaultProps = {
  onClick: () => {},
  buttons: [],
};

export default SegmentedButtons;
