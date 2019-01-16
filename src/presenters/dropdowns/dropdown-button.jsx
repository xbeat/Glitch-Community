import React from 'react';
import PropTypes from 'prop-types';

export default class DropdownButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      menuVisible: false,
    }
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  
  toggleMenu(evt){
    this.setState({menuVisible: !this.state.menuVisible});
  }
  
  render(){
    return(
      <>
        <button className="button-small button-tertiary" onClick={() => this.toggleMenu}>{this.props.button.label}</button>
      
        { this.state.menuVisible && 
          <dialog className="pop-over mini-pop">
            { this.props.menu.map(item => (
              <DropdownItem item={item}/>
            ))};                     
          </dialog>
        }
      
      </>
    )
  } 
}

DropdownButton.propTypes = {
  button: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  menu: PropTypes.object.isRequired,
  menuVisible: PropTypes.bool,
}

export const DropdownItem = ({item}) => {
  return(
    <section className="mini-pop-action">{item.name}{item.avatar}</section>
    )
}

DropdownItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.obj.isRequired,
  }).isRequired,
}