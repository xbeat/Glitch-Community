import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

import OverlaySelectCollection from '../overlays/overlay-select-collection.jsx';
import NestedPopover from './popover-nested.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

// Collection Options Content
const CollectionOptionsContent = ({...props}) => {
  
  return(
    <dialog className="pop-over collection-options-pop">
      <section className="pop-over-actions danger-zone last-section">
          <PopoverButton onClick={() => props.deleteCollection(props.collection.id)} text="Delete Collection " emoji="bomb"/>
        {/*
        {props.deleteCollection && <PopoverButton onClick={() => props.deleteCollection(props.collection.id)} text="Delete Collection " emoji="bomb"/>}
        */}
        </section>
    </dialog>
    );
}

// Collection Options Pop
const CollectionOptionsPop = (props) => {
  return(
    <CollectionOptionsContent {...props} />
  );
};

CollectionOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  deleteCollection: PropTypes.func,
};
  
// Collection Options Container
export default function CollectionOptions({collectionOptions={}, collection}) {
  if(Object.keys(collectionOptions).length === 0) {
    return null;
  }

  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <CurrentUserConsumer>
          {user => (
            <div className="collection-pop-over">
              <button className="collection-options button-borderless opens-pop-over" onClick={togglePopover}> 
                <div className="down-arrow" />
              </button>
              { visible && <CollectionOptionsPop collection={collection} {...collectionOptions} togglePopover={togglePopover} currentUser={user}/> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
};

