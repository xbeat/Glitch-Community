import React from 'react';
import PropTypes from 'prop-types';

export class PopoverNested extends React.Fragment {
  constructor(props) {
    super(props);
    this.state = {
      page: null, // null or undefined show the default page
    };
    this.setPage = this.setPage.bind(this);
  }
  
  setPage(page) {
    this.setState({page});
  }
  
  render() {
  }
}

PopoverNested.propTypes = {
  children: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default PopoverNested;