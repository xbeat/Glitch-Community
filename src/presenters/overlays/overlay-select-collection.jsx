import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import categories from '../../curated/categories.js';

import CollectionResultItem from '../includes/collection-result-item.jsx';

const OverlaySelectCollection = ({children, domain}) => (
  <>
    <PopoverContainer>
      {({visible, setVisible, togglePopover}) => (
        <details onToggle={evt => setVisible(evt.target.open)} open={visible} className="overlay-container">
          <summary>{children}</summary>
          <dialog className="overlay overlay-collection">
            <section className="pop-over-actions">
              <section className="title">
                <span>Add {domain} to collection</span>
              </section>            
              <section className="pop-over-actions results-list">
                <ul className="results">
                  <li>
                    <CollectionResultItem
                      projectName={domain}
                      collectionName={categories[0].name}
                      description={categories[0].description}
                      id={categories[0].id}
                      avatarUrl={categories[0].avatarUrl}
                      url={categories[0].url}
                      isActive={false}
                      togglePopover={togglePopover}
                    />
                  </li>
                  <li>
                    <CollectionResultItem 
                      projectName={domain}
                      collectionName={categories[1].name} 
                      description={categories[1].description} 
                      id={categories[1].id.toString()} 
                      avatarUrl={categories[1].avatarUrl} 
                      url={categories[1].url} isActive={false} 
                      togglePopover={togglePopover} 
                    />
                  </li>
                  <li>
                    <CollectionResultItem 
                      projectName={domain}
                      collectionName={categories[2].name} 
                      description={categories[2].description} 
                      id={categories[2].id.toString()} 
                      avatarUrl={categories[2].avatarUrl} 
                      url={categories[2].url} isActive={false} 
                      togglePopover={togglePopover} 
                    />
                  </li>
                  <li>
                    <CollectionResultItem 
                      projectName={domain}
                      collectionName={categories[3].name} 
                      description={categories[3].description} 
                      id={categories[3].id.toString()} 
                      avatarUrl={categories[3].avatarUrl} 
                      url={categories[3].url} isActive={true} 
                      togglePopover={togglePopover} 
                    />
                  </li>
                </ul>
              </section>
              <section className="pop-over-info">
                <input id="collection-name"  
                  no-autofocus // eslint-disable-line jsx-a11y/no-autofocus
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
  </>
);
OverlaySelectCollection.propTypes = {
  children: PropTypes.node.isRequired,
  domain: PropTypes.string.isRequired,
};


export default OverlaySelectCollection;