import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

const validHex = (hex) =>{
  var re = /[0-9A-Fa-f]{6}/g;
  if(re.test(hex)){
    return true;
  }
  return false;
};

class EditCollectionColorPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: this.props.initialColor,
      color: this.props.initialColor,
      maybeRequest: null,
      maybeResults: null
    };
    
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this); // for when user enters in custom hex
    this.keyPress = this.keyPress.bind(this); // handles enter key for custom hex
    this.getRandomColor = this.getRandomColor.bind(this); // gets random color
    this.update = this.props.updateColor;
  }
    
  handleChange(e) {
    let query = e.currentTarget.value.trim();
    const errorMsg = document.getElementsByClassName("editable-field-error-message")[0];
    errorMsg.style.display = "none";
    this.setState({ query });
    if (query && query.length <=7) {
      if(validHex(query)){
        if(query[0] !== "#"){
          query = "#" + query;
        }
        this.setState({color: query});
        this.update(query);
      }else{
        errorMsg.style.display = "inherit";
      }
    }else{
      // user has cleared the input field
      errorMsg.style.display = "inherit";
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
  }
  
  getRandomColor(){
    let newCoverColor = randomColor({luminosity: 'light'});
    this.setState({ color: newCoverColor});
    this.setState({ query: newCoverColor});
    this.update(newCoverColor);
  }
  
  render() {    
    return (
      <dialog className="pop-over edit-collection-color-pop">
        <section className="pop-over-info">          
         
          <button className="color-preview-btn button-tertiary" style={{backgroundColor: this.state.color}}/>
          
          <input id="color-picker"
            value={this.state.query} 
            onChange={this.handleChange} 
            onKeyPress={this.keyPress}
            className={"pop-over-input pop-over-search"}
            placeholder="Custom color hex"
          />
          
          <div className="editable-field-error-message">
            Invalid Hex
          </div>
        </section>
          
        <section className="pop-over-info">  
          <button className="random-color-btn button-tertiary" onClick={this.getRandomColor}>Random <span className="emoji bouquet"></span></button>
        </section>
        
      </dialog>
    );
  }
}

EditCollectionColorPop.propTypes = {
  updateColor: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};

export default EditCollectionColorPop;