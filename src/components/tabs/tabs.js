import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './tabs.styl';
import { Tabs, TabList, Tab, } from "@reach/tabs"

const cx = classNames.bind(styles);

const Tabs = ({ data, onClick }) => {
  return(
    <Tabs>
      { data.map((tab, index)) => (
        <Tab key={index}>tab.label</Tab>
        ))};
    </Tabs>
    );
}

