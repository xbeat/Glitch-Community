import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

const DropdownMenu = ({contents, selected, updateSelected}) => {
  return(
    <dialog className="pop-over mini-pop">
    { contents.map((item, index) => (
       <section className={"mini-pop-action" + (index == selected ? " selected" : "")} key={index} 
         onClick={() => updateSelected(index)}>
          {item}
        </section>
     ))}
    </dialog>
)};

DropdownMenu.propTypes = {
  contents: PropTypes.node.isRequired,
  selected: PropTypes.number.isRequired,
  updateSelected: PropTypes.func.isRequired,
};


const PopoverDropdown = props => {
  return (
    <PopoverContainer>
      {({ visible, togglePopover }) => {
        let childrenToShow = props.children;
        return (
          <div className={"button-wrap " + props.containerClass}>
            <button
              className={props.buttonClass}
              data-track={props.dataTrack}
              onClick={togglePopover}
              type="button"            
            >
              {props.buttonText}
              {<span className="down-arrow icon" aria-label="options"></span>}
              
            </button>
            {visible && childrenToShow}
            <DropdownMenu contents={this.props.menuContents} selected={this.state.selected} updateSelected={this.updateSelected}/>
          </div>
        );
      }}
    </PopoverContainer>
  );
};

PopoverDropdown.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  dataTrack: PropTypes.string,
  dropdown: PropTypes.bool,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool
};

PopoverDropdown.defaultProps = {
  buttonClass: "",
  containerClass: "",
  dataTrack: "",
  passToggleToPop: false
};

export default PopoverDropdown