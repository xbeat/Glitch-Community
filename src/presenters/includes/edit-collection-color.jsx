
import React from "react";
import PropTypes from "prop-types";

import EditCollectionColorPop from "../pop-overs/edit-collection-color-pop.jsx";
import PopoverWithButton from '../pop-overs/popover-with-button';

class EditCollectionColor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };

    this.togglePopover = this.togglePopover.bind(this);
  }

  togglePopover() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { update, initialColor, ...props } = this.props;
    return (
      // wrapper class edit-collection-color-btn
      <PopoverWithButton
        buttonText="Color"
        buttonClass="edit-collection-color-btn"
        passToggleToPop
      >
        <EditCollectionColorPop
          {...props}
          updateColor={update}
          initialColor={initialColor}
        />
      </PopoverWithButton>
    );
  }
}

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired
};
