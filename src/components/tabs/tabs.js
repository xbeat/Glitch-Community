import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './tabs.styl';
import { Tabs, TabList, Tab, } from "@reach/tabs"

const cx = classNames.bind(styles);

const TabSet = ({ data, onClick }) => {
  const classNames = cx({
  });
  
  return(
    <Tabs>
      { data.map((tab, index) => (
        <Tab key={index}>{tab.label} onClick={onClick}</Tab>
      ))};
    </Tabs>
    );
}

TabSet.propTypes = {
  data: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

TabSet.defaultProps = {
  onClick: () => {},
}

export default TabSet;