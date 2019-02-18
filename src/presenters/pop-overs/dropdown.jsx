import React from "react";
import PropTypes from "prop-types";
import Select from "react-select"; // https://react-select.com/

// Options passed to Dropdown are expected to be formatted like options = [ {value: optionValue, label: optionLabel}, ... ]
class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.options[0] // set to the first option by default
    };
    this.updateSelected = this.updateSelected.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedOption.value !== this.state.selectedOption.value; // render is continually called without this check...
  }

  updateSelected(option) {
    this.setState({
      selectedOption: option
    });
    // pass selected value back to onUpdate
    this.props.onUpdate(option.value);
  }

  render() {
    return (
      <Select
        autoWidth={true}
        value={this.state.selectedOption}
        options={this.props.options}
        className={"dropdown " + this.props.containerClass}
        classNamePrefix="dropdown"
        onChange={this.updateSelected}
        isSearchable={false}
        aria-label="test"
      />
    );
  }
}

Dropdown.propTypes = {
  containerClass: PropTypes.string,
  options: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default Dropdown;
