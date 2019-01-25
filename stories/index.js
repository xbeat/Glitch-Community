import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ))
  .add('with different text', () => (
    <Button>Hello Second Button</Button>
  ));   

<!-- <button
              className={props.buttonClass}
              data-track={props.dataTrack}
              onClick={togglePopover}
            >
              //{props.buttonText}
            </button> -->
