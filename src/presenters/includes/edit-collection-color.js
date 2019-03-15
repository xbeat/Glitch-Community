import React from 'react';
import PropTypes from 'prop-types';

import PopoverWithButton from 'src/components/popovers/popover-with-button';
import EditCollectionColorPop from 'src/presenters/pop-overs/edit-collection-color-pop';

const EditCollectionColor = ({ update, initialColor, ...props }) => (
  <PopoverWithButton containerClass="edit-collection-color-btn" buttonClass="add-project" buttonText="Color" passToggleToPop>
    <EditCollectionColorPop {...props} updateColor={update} initialColor={initialColor} />
  </PopoverWithButton>
);

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};
