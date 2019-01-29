import React from 'react';
import { storiesOf } from '@storybook/react';
import Button, { TYPES } from '../src/atoms/button/button';
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
    <ButtonWithEmoji emoji="https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fframed_picture.png?1496341054682">Emoji Button</ButtonWithEmoji>
  ))
.add('small emoji', () => (
    <ButtonWithEmoji emoji="https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Fmicrophone.png?1507674704246" size="small">Remix this</ButtonWithEmoji>
  ))
.add('additional emoji', () => (
    <ButtonWithEmoji emoji="https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg" type="cta">Show</ButtonWithEmoji>
  ))

// <button
//               className={props.buttonClass}
//               data-track={props.dataTrack}
//               onClick={togglePopover}
//             >
//               //{props.buttonText}
//             </button>
    