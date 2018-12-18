import React from "react";
import PropTypes from "prop-types";

import EditCollectionColorPop from "../pop-overs/edit-collection-color-pop.jsx";
import PopoverContainer from "../pop-overs/popover-container.jsx";

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
      <PopoverContainer>
        {({ visible, togglePopover }) => (
          <div className="button-wrap edit-collection-color-btn">
            <button
              className={`button add-project opens-pop-over`}
              onClick={togglePopover}
            >
              Color
            </button>
            {visible && (
              <EditCollectionColorPop
                {...props}
                togglePopover={togglePopover}
                updateColor={update}
                initialColor={initialColor}
              />
            )}
          </div>
        )}
      </PopoverContainer>
    );
  }
}

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired
};
