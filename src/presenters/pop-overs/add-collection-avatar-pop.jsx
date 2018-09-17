import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import {avatars} from '../../models/collection.js'; 

class AddCollectionAvatarPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      avatar: null,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);

  }
  
  handleChange(evt) {
    console.log(evt);
    // apply styling change to selected button
  }
  
  onClick(type) {
    console.log(`toggling popover for ${type}`);
    // change the avatar on the page
    this.props.setAvatar(avatars[type]);
    
    // toggle the pop-over
    this.props.togglePopover();      
  }
  
  
  render() {
    return (
      <dialog className="pop-over add-collection-avatar-pop wide-pop">
        <section className="pop-over-info">
          { Object.keys(avatars).map( type => (
            <button className="collection-avatar button-tertiary" onClick={() => this.onClick(type)}>
              <img src={avatars[type]} alt={type}/>
            </button>
          )) }
        </section>
      </dialog>
    );
  }
}

AddCollectionAvatarPop.propTypes = {
  api: PropTypes.func.isRequired,
};

export default AddCollectionAvatarPop;