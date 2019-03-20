import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { MemoryRouter } from 'react-router-dom';

const enableLinks = (story) => <MemoryRouter>{story()}</MemoryRouter>

addDecorator(
  withInfo({
    header: false, // Global configuration for the info addon across all of your stories.
  }),
  enableLinks
);

function loadStories() {
  require('../stories/index.js');
  
  // You can require as many stories as you need.
}

configure(loadStories, module);
