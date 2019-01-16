import React from "react";
import PropTypes from "prop-types";
import PopoverWithButton from "./popover-with-button";

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


class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      selected: 0, 
      buttonContents: this.props.buttonContents
    };
    
    this.updateSelected = this.updateSelected.bind(this);
  }
  
  componentDidMount(){
    // set default menu item here
  }
  
  updateSelected(itemIndex){
    this.setState({
      selected: itemIndex,
      buttonContents: this.props.menuContents[itemIndex],
    });
  }
  
  render(){
    return(
      <PopoverWithButton
        buttonClass="button-small dropdown-btn user-or-team-toggle"
        buttonText={this.state.buttonContents}
        containerClass="dropdown"
        dropdown={true}
      > 
        <DropdownMenu contents={this.props.menuContents} selected={this.state.selected} updateSelected={this.updateSelected}/>
      </PopoverWithButton>
    )
  }
}

Dropdown.propTypes = {
  buttonContents: PropTypes.node.isRequired,
  menuContents: PropTypes.node.isRequired,
}

export default Dropdown;