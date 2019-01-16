import React from "react";
import PropTypes from "prop-types";
import PopoverWithButton from "./popover-with-button";

const DropdownMenu = ({contents, selected, updateSelected}) => {
  return(
    <dialog className="pop-over mini-pop">
    { contents.map(item => (
       <section className="mini-pop-action">{item} onClick={() => updateSelected}></section>
     ))}
    </dialog>
)};

DropdownMenu.propTypes = {
  contents: PropTypes.node.isRequired,
  selected: PropTypes.node.isRequired,
  updateSelected: PropTypes.func.isRequired,
};


class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state({ 
      selected: null, 
      buttonContents: [],
      menuContents: [],
    });
    
    this.updateSelected = this.updateSelected.bind(this);
  }
  
  componentDidMount(){
    // set default menu item here
  }
  
  updateSelected(selectedItem){
    this.setState({
      selected: selectedItem,
      buttonText: selectedItem.name
    });
  }
  
  render(){
    <PopoverWithButton
      buttonClass="button-small"
      buttonText={this.state.buttonContents}
    > 
      <DropdownMenu contents={this.state.menuContents} selected={this.state.selected} updateSelected={this.updateSelected}/>
    </PopoverWithButton>
  }
}

Dropdown.propTypes = {
  buttonContents: PropTypes.node.isRequired,
  menuContents: PropTypes.obj.isRequired,
}