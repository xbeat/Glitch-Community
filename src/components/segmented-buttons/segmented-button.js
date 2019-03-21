import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './segmented-button.styl';
import Button from '../../components/buttons/button';

const cx = classNames.bind(styles);

const className = cx({
  'segmented-buttons': true,
});

class SegmentedButtons extends React.Component {
  constructor(props){
    this.state = {
      activeFilter: this.props.buttons[0]
    }
    this.setFilter = this.setFilter.bind(this);
  }
  
  setFilter(filter){
    this.setState({ activeFilter: filter });
  }
  
  render(){
  const { buttons, onClick } = this.props;
  const { setFilter } = this.state;
    
    return (
      <div className={className}>
        {buttons.map( (button) => (
          <Button
            size="small"
            type="tertiary"
            active={button.active}
            onClick={setFilter}
            >
            {button.contents}
          </Button>
          ))}
      </div>
    );
  }
};

SegmentedButtons.propTypes = {
  buttons: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  type: null,
  size: null,
  hover: false,
  active: false,
};

export default Button;
