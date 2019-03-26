import { configure, addDecorator } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const enableLinks = (story) => <MemoryRouter>{story()}</MemoryRouter>

addDecorator(
  enableLinks
);

function loadStories() {
  require('../stories/index.js');
  
  // You can require as many stories as you need.
}

configure(loadStories, module);
