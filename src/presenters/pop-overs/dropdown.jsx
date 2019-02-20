import React from "react";
import PropTypes from "prop-types";
import Select from "react-select"; // https://react-select.com/

// Options passed to Dropdown are expected to be formatted like options = [ {value: optionValue, label: optionLabel}, ... ]
class Dropdown extends React.Component {

  render() {
    return (
      <Select
        autoWidth={true}
        value={this.props.selection}
        options={this.props.options}
        className={"dropdown " + this.props.containerClass}
        classNamePrefix="dropdown"
        onChange={this.props.onUpdate}
        isSearchable={false}
      />
    );
  }
}

Dropdown.propTypes = {
  containerClass: PropTypes.string,
  options: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selection: PropTypes.object.isRequired,
};

export default Dropdown;
