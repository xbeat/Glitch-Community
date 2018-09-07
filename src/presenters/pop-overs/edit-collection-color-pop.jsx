import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import {colors} from '../../models/collection.js';

import Loader from '../includes/loader.jsx';

const validHex = (hex) =>{
  var re = /[0-9A-Fa-f]{6}/g;
  if(re.test(hex)){
    return true;
  }else{
    return false;
  }
}

class EditCollectionColorPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The hex value entered into search
      color: null,
      maybeRequest: null,
      maybeResults: null
    };
    
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }
    
  handleChange(e) {
    const query = e.currentTarget.value.trim();
    document.getElementsByClassName("editable-field-error-message")[0].style.display = "none";
    this.setState({ query });
    if (query && query.length <=7) {
      if(validHex(query)){
        this.props.setColor(query);
      }else{
        document.getElementsByClassName("editable-field-error-message")[0].style.display = "inherit";
      }
    }else{
      document.getElementsByClassName("editable-field-error-message")[0].style.display = "inherit";
    }
  }
  
  keyPress(e){
    if(e.which == 13 || e.keyCode == 13){
      // enter key pressed - dismiss pop-over
      this.props.togglePopover();
    }else{
      document.getElementsByClassName("editable-field-error-message")[0].style.display = "none";
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
          
          {Object.keys(colors).map((key => 
            <button className="button-tertiary" key={key}
              style={{backgroundColor: colors[key]}} 
              onClick={() => this.props.setColor(colors[key])}
            />
          ))}
          
          <hr/>
          
          <input id="color-picker" 
            no-autofocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange} onKeyPress={this.keyPress}
            className="pop-over-input pop-over-search"
            placeholder="Custom color hex"
          />
          
          <div className="editable-field-error-message">
            Invalid Hex!
          </div>
          
        </section>
      </dialog>
    );
  }
}

EditCollectionColorPop.propTypes = {
  api: PropTypes.func.isRequired,
  collectionID: PropTypes.number.isRequired
};

export default EditCollectionColorPop;