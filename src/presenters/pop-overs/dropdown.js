import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'; // https://react-select.com/

// Options passed to Dropdown are expected to be formatted like options = [ {value: optionValue, label: optionLabel}, ... ]
const Dropdown = (props) => (
  <Select
    autoWidth
    value={props.selection}
    options={props.options}
    className={`dropdown ${props.containerClass}`}
    classNamePrefix="dropdown"
    onChange={props.onUpdate}
    isSearchable={false}
  />
);

Dropdown.propTypes = {
  containerClass: PropTypes.string,
  options: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selection: PropTypes.object.isRequired,
};

Dropdown.defaultProps = {
  containerClass: '',
};

export default Dropdown;
