import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button, TYPES } from '../src/atoms/button/button';
import ButtonWithEmoji from '../src/molecules/button-with-emoji/button-with-emoji';

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

storiesOf('Button With Emoji', module)
  .add('regular', () => (
    <ButtonWithEmoji>Hello Button</ButtonWithEmoji>
  ))

// <button
//               className={props.buttonClass}
//               data-track={props.dataTrack}
//               onClick={togglePopover}
//             >
//               //{props.buttonText}
//             </button>
    