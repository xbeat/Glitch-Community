import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionAvatarPop from '../pop-overs/add-collection-avatar-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddCollectionAvatar = ({update, ...props}) => {
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button button-small button-tertiary replace-avatar opens-pop-over`} onClick={togglePopover}>
              Replace Avatar
          </button>
          { visible && <AddCollectionAvatarPop {...props} togglePopover={togglePopover} updateAvatar={update} /> }
        </div>
      )}
    </PopoverContainer>
  );
};

AddCollectionAvatar.propTypes = {
  api: PropTypes.func.isRequired
};

export default AddCollectionAvatar;
