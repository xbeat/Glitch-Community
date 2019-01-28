import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/atoms/button/button';

storiesOf('Button', module)
  .add('regular', () => (
    <Button>Hello Button</Button>
  ))
  .add('cta', () => (
    <Button type="cta">CTA Button</Button>
  ))
  .add('small', () => (
    <Button size="small">Small Button</Button>
  ))
.add('tertiary', () => (
    <Button type="tertiary">Tertiary Button</Button>
  ));   

// <button
//               className={props.buttonClass}
//               data-track={props.dataTrack}
//               onClick={togglePopover}
//             >
//               //{props.buttonText}
//             </button>
    