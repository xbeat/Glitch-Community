import React from 'react';
import PropTypes from 'prop-types';

const {Consumer} = React.createContext();

export default class Dropdown extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <dialog className="pop-over mini-pop">
        
      </dialog>
      )
  }
  
  }
}

export const DropdownItem = ({content}) => {
  return(
    <section className="mini-pop-action">{content.name}{content.avatar}</section>
    )
}