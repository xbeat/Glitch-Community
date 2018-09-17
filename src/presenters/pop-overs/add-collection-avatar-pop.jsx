import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';


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
    // apply styling change to selected button
  }
  
  onClick() {
    this.props.togglePopover();    
  }
  
  render() {
    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/0a15009e-17ee-4915-bc29-5ba03bb09517%2Fshapes.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Feducation.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/0a15009e-17ee-4915-bc29-5ba03bb09517%2Fcoffee.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fdiamond.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Frobot.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fart.svg?1499357014248"/>
          </button>
          <button className="collection-avatar button-tertiary">
            <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002"/>
          </button>
        </section>
      </dialog>
    );
  }
}

AddCollectionAvatarPop.propTypes = {
  api: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  togglePopover: PropTypes.array.isRequired,
};

export default AddCollectionAvatarPop;