import React from 'react';
import PropTypes from 'prop-types';

const {Consumer} = React.createContext();

export default class DropdownButton extends React.Component{
  constructor(props){
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  
  toggleMenu(evt){
    
  }
  
  render(){
    return(
      <>
        <button className="button-small button-tertiary" onClick={() => this.toggleMenu}>{this.props.button.name}</button>
        <dialog className="pop-over mini-pop">
          { this.props.content.map(item => (
            <DropdownItem item={item}/>
          ))};                     
        </dialog>
      </>
    )
  } 
}

DropdownButton.propTypes = {
  button: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  menu: PropTypes.object.isRequired,
}

export const DropdownItem = ({item}) => {
  return(
    <section className="mini-pop-action">{item.name}{item.avatar}</section>
    )
}

DropdownItem.propTypes = {
  item: PropTypes.object.isRequired,
}