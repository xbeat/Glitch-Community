import React from 'react';
import PropTypes from 'prop-types';

import {avatars} from '../../models/collection.js'; 

class AddCollectionAvatarPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      avatar: null,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.update = this.props.updateAvatar;

  }
  
  handleChange(evt) {
    console.log(evt);
    // apply styling change to selected button
  }
  
  onClick(type) {
    // console.log(`toggling popover for ${type}`);
    // change the avatar on the page
    this.setState({avatar: avatars[type]});
    this.update(avatars[type]);
    
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
  updateAvatar: PropTypes.func.isRequired,
};

export default AddCollectionAvatarPop;