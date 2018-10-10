import React from 'react';
import PropTypes from 'prop-types';

import EditCollectionColorPop from '../pop-overs/edit-collection-color-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const EditCollectionColor = ({update, ...props}) => {  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
                Color
          </button>
          { visible && <EditCollectionColorPop {...props} togglePopover={togglePopover} updateColor={update} /> }
        </div>
      )}
    </PopoverContainer>
  );
};

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
};