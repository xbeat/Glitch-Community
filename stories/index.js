import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/components/buttons/button';
import TooltipContainer from '../src/components/tooltip-container';

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
    <Button type="tertiary" size="small">Tertiary (Small) Button</Button>
  ))
.add('danger zone', () => (
    <Button type="dangerZone" size="small">Destructive Action</Button>
  ));

storiesOf('TooltipContainer', module)
  .add('base', () => (
    <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>}> tooltip="I'm a tooltip"></TooltipContainer>
  ))