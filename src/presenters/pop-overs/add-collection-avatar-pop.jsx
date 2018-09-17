import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

const avatars = {
  computer: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg",
  tetris: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg",
  shapes: "https://cdn.hyperdev.com/0a15009e-17ee-4915-bc29-5ba03bb09517%2Fshapes.svg",
  education: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Feducation.svg",
  coffee: "https://cdn.hyperdev.com/0a15009e-17ee-4915-bc29-5ba03bb09517%2Fcoffee.svg",
  diamond: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fdiamond.svg",
  robot: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Frobot.svg",
  hardware: "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg",
  art: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fart.svg?1499357014248",
  music: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002",
}

const computer = "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg";
const tetris = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg";
const shapes = "https://cdn.hyperdev.com/0a15009e-17ee-4915-bc29-5ba03bb09517%2Fshapes.svg";
const education = "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Feducation.svg";
const coffee = "https://cdn.hyperdev.com/0a15009e-17ee-4915-bc29-5ba03bb09517%2Fcoffee.svg";
const diamond = "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fdiamond.svg";
const robot = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Frobot.svg";
const hardware = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg";
const art = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fart.svg?1499357014248";
const music = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002";

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
    console.log('toggling popover');
    // change the avatar on the page
    switch(type){
      case "computer":
        break;
    case "computer":
        break;
    case "computer":
        break;
    case "computer":
        break;
    case "computer":
        break;
    }
    
    // toggle the pop-over
    this.props.togglePopover();      
  }
  
  
  render() {
    return (
      <dialog className="pop-over add-collection-avatar-pop wide-pop">
        <section className="pop-over-info">
          { Object.keys(avatars).map( type => (
            <button className="collection-avatar button-tertiary" onClick={() => this.onClick(type)}>
              <img src={avatars[type]}/>
            </button>
          }) }
        </section>
      </dialog>
    );
  }
}

AddCollectionAvatarPop.propTypes = {
  api: PropTypes.func.isRequired,
};

export default AddCollectionAvatarPop;