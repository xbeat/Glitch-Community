import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import Loader from '../includes/loader.jsx';

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
    this.setState({ query });
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
          
          <button className="button-tertiary">
            <div className="color-option" style={{backgroundColor: red}}>place Avatar</div>
          </button>
          
          <input id="color-picker" 
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Custom color hex"
          />
        </section>
      </dialog>
    );
  }
}

EditColorColorPop.propTypes = {
  api: PropTypes.func.isRequired,
  collectionID: PropTypes.number.isRequired
};

export default EditColorColorPop;