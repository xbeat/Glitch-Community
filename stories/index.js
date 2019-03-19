/* global EXTERNAL_ROUTES */
import React from 'react';
import MemoryRouter from 'react-router';
import { storiesOf } from '@storybook/react';
// import Button from '../src/components/buttons/button';
import TooltipContainer from '../src/components/tooltips/tooltip-container';
import TextInput from 'Components/fields/text-input';
import TextArea from '../src/components/fields/text-area';
import Heading from 'Components/text/heading';
import Markdown from '../src/components/text/markdown';

// const external = EXTERNAL_ROUTES ? Array.from(EXTERNAL_ROUTES) : [];
// console.log(external)

// storiesOf('Button', module)
//   .addDecorator(story => (
//       <MemoryRouter initialEntries={['./']}>{story()}</MemoryRouter>
//   ))
//   .add('regular', () => <Button>Hello Button</Button>)
//   .add('cta', () => <Button type="cta">CTA Button</Button>)
//   .add('small', () => <Button size="small">Small Button</Button>)
//   .add('tertiary', () => (
//     <Button type="tertiary" size="small">
//       Tertiary (Small) Button
//     </Button>
//   ))
//   .add('danger zone', () => (
//     <Button type="dangerZone" size="small">
//       Destructive Action
//     </Button>
//   ));

// storiesOf('TooltipContainer', module)
//   .addDecorator(story => (
//       <MemoryRouter initialEntries={['../']}>{story()}</MemoryRouter>
//   ))
  // .add('action', () => (
  //   <div style={{ margin: '70px' }}>
  //     <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm an action tooltip" />
  //   </div>
  // ))
  // .add('info', () => (
  //   <div style={{ margin: '70px' }}>
  //     <TooltipContainer
  //       type="info"
  //       id="a-unique-id"
  //       target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
  //       tooltip="I'm an info tooltip"
  //     />
  //   </div>
  // ))
  // .add('persistent', () => (
  //   <div style={{ margin: '70px' }}>
  //     <TooltipContainer
  //       type="info"
  //       id="a-unique-id"
  //       target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
  //       tooltip="I'm a persistent tooltip"
  //       persistent
  //     />
  //   </div>
  // ))
  // .add('left and top aligned', () => (
  //   <div style={{ margin: '70px' }}>
  //     <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm a tooltip" align={['top', 'left']} />
  //   </div>
  // ));

storiesOf('Text Input', module)
  .add('regular', () => <TextInput placeholder="type something!" />)
  .add('login', () => <TextInput placeholder="type something!" prefix="@" />)
  .add('search', () => <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users" />)
  .add('with error', () => <TextInput placeholder="glitch" error="That team already exists" />)
  .add('text area', () => <TextArea placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required" />);

storiesOf('Heading', module)
  .add('h1 ', () => <Heading tagName="h1">H1, 22px</Heading>)
  .add('h2', () => <Heading tagName="h2">H2, 18px</Heading>)
  .add('h3', () => <Heading tagName="h3">H3, 16px</Heading>)
  .add('h4', () => <Heading tagName="h4">H4, 14px</Heading>);

// storiesOf('Markdown', module)
//   .addDecorator(story => (
//       <MemoryRouter initialEntries={['../']}>{story()}</MemoryRouter>
//   ))
//   .add('regular', () => <Markdown>Some __Markdown__</Markdown>)
//   .add('truncated', () => <Markdown length={35}>35 characters of rendered __Markdown__ (and a little **more**)</Markdown>);
