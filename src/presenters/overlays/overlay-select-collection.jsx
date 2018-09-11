import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import categories from '../../curated/categories.js';

import CollectionResultItem from '../includes/collection-result-item.jsx';

import AddProjectNotify from '../includes/added-project-to-collection.jsx';

const OverlaySelectCollection = ({children, domain}) => (
  <PopoverContainer>
    {({visible, setVisible}) => (
      <details onToggle={evt => setVisible(evt.target.open)} open={visible} className="overlay-container">
        <summary>{children}</summary>
        <dialog className="overlay overlay-collection">
          <section className="pop-over-actions">
            <section className="title">
              <span>Add {domain} to collection</span>
              
            </section>            
            <section class="pop-over-actions results-list">
              <ul class="results">
              <li>
               <CollectionResultItem domain={categories[0].name} description={categories[0].description} id={categories[0].id} avatarUrl={categories[0].avatarUrl} url={categories[0].url} isActive={false} action={() => null} />
              </li>
            </ul>
          </section>
          <section className="pop-over-info">
            <input id="collection-name"  
              no-autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              value={null} onChange={null}
              className="pop-over-input create-input"
              placeholder="New Collection Name"
            />
            {/* TO DO: Actually create a new collection here */}
            <button className="create-collection button-small">
              Create
            </button>
          </section>
        </section>
      </dialog>
    </details>
    )}
  </PopoverContainer>
);
OverlaySelectCollection.propTypes = {
  children: PropTypes.node.isRequired,
  domain: PropTypes.string.isRequired,
};

export default OverlaySelectCollection

{/*
TO DO: trigger project notify
  <AddProjectNotify/>
*/