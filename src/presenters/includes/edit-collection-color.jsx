import React from 'react';
import PropTypes from 'prop-types';

import EditCollectionColorPop from '../pop-overs/edit-collection-color-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const EditCollectionColor = ({currentUserIsOwner, ...props}) => {
  if(!currentUserIsOwner) {
    return null;
  }
  
  return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
            <React.Fragment>
              <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
                Color
              </button>
              { visible && <EditCollectionColorPop {...props} togglePopover={togglePopover} /> }
            </React.Fragment>
        )}
      </PopoverContainer>
  );
};

EditCollectionColor.propTypes = {
  api: PropTypes.func.isRequired,
  collectionID: PropTypes.number.isRequired,
  currentUserIsOwner: PropTypes.bool.isRequired
};

class EditColorColorPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The hex value entered into search
      color: null,
      maybeRequest: null,
      maybeResults: null
    };
    
    this.onClick = this.onClick.bind(this);
  }
    
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    // this.setState({ query });
    if (query) {
      {/* TO DO: check if valid hex and apply color to background */}
      
    } else {
      {/* TO DO: error message here if invalid */}
      
    }
  }
    
  onClick() {
    this.props.togglePopover();
    {/* TO DO - apply color change here*/}
  }
  
  render() {
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    return (
      <dialog className="pop-over edit-collection-color-pop">
        <section className="pop-over-info">
          {/* TO DO - add buttons and input field*/}
          <input id="color-picker" 
            no-autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Custom color hex"
          />
        </section>}
      </dialog>
    );
  }
}

EditColorColorPop.propTypes = {
  api: PropTypes.func.isRequired,
  collectionID: PropTypes.number.isRequired
};

export default EditCollectionColor;
