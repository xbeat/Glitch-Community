import React from 'react';
import PropTypes from 'prop-types';

const Thanks = ({count}) => {
  return (
    <div className="loader">
      <div className="moon"></div>
      <div className="earth"></div>
      <div className="asteroid"></div>    
      <div className="asteroid-dust"></div>    
    </div>    
  );
};

Thanks.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Thanks;
