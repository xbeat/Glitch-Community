import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import categories from '../../curated/categories.js';

import CollectionResultItem from '../includes/collection-result-item.jsx';

import Notifications from '../notifications.jsx';

const AddProjectMessage = ({projectName, collectionName}) => (
  <React.Fragment>
    <p>Added <b><span className="project-name">{projectName}</span></b> to collection <b><span className="collection-name">{collectionName}</span></b></p>
    <a href={collectionName} target="_blank" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
  </React.Fragment>
);
AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

const notify = (togglePopover, projectName, collectionName, createNotification) => {
  togglePopover();
  
  const content = <AddProjectMessage {...{projectName, collectionName}}/>;
  createNotification(content, "notifySuccess");

};


const OverlaySelectCollection = ({children, domain}) => (
  <React.Fragment>
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
                    <Notifications>
                      {({createNotification}) => (
                        <CollectionResultItem
                          domain={categories[0].name}
                          description={categories[0].description}
                          id={categories[0].id}
                          avatarUrl={categories[0].avatarUrl}
                          url={categories[0].url}
                          isActive={false} 
                          action={notify(togglePopover, domain, categories[0].url, createNotification)}
                        />
                      )}
                    </Notifications>
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
  </React.Fragment>
);
OverlaySelectCollection.propTypes = {
  children: PropTypes.node.isRequired,
  domain: PropTypes.string.isRequired,
};


export default OverlaySelectCollection;