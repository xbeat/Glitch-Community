import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import PopoverWithButton from './popover-with-button';
import {CurrentUserConsumer} from '../current-user.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

// Collection Options Pop
const CollectionOptionsPop = (props) => {
  
  function animate(event, className, func) {
    const collectionContainer = event.target.closest('li');
    collectionContainer.addEventListener('animationend', func, {once: true});
    collectionContainer.classList.add(className);
    props.togglePopover();
  }

  function animateThenDeleteCollection(event) {
    if(!window.confirm(`Are you sure you want to delete your collection?`)){
      return;
    }
    animate(event, 'slide-down', () => props.deleteCollection(props.collection.id));    
  }  
  
  return(
    <dialog className="pop-over collection-options-pop">
      <section className="pop-over-actions danger-zone last-section">
        {props.deleteCollection && <PopoverButton onClick={animateThenDeleteCollection} text="Delete Collection " emoji="bomb"/>}
        
      </section>
    </dialog>
  );
};

CollectionOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  deleteCollection: PropTypes.func,
};
  
// Collection Options Container
export default function CollectionOptions({deleteCollection, collection}) {
  if(!deleteCollection) {
    return null;
  }

  return (
    <PopoverWithButton buttonClass='button'
      buttonText={<div className="down-arrow"/>} 
      buttonClass="collection-options button-borderless opens-pop-over">
      <CurrentUserConsumer>
          {user => <CollectionOptionsPop collection={collection} 
                     deleteCollection={deleteCollection} 
                     currentUser={user}/>}
      </CurrentUserConsumer>
    </PopoverWithButton>);
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

