import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/atoms/button/button';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('new button', () => (
    <Button type="cta" disabled="true">New Button</Button>
  ));   

// <button
//               className={props.buttonClass}
//               data-track={props.dataTrack}
//               onClick={togglePopover}
//             >
//               //{props.buttonText}
//             </button>
    