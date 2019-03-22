import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/components/buttons/button';
import TooltipContainer from '../src/components/tooltips/tooltip-container';
import TextInput from '../src/components/fields/text-input';
import TextArea from '../src/components/fields/text-area';
import Text from '../src/components/text/text';
import Heading from '../src/components/text/heading';
import Markdown from '../src/components/text/markdown';
import Badge from '../src/components/badges/badge';
import SegmentedButtons from '../src/components/buttons/segmented-buttons';

storiesOf('Button', module)
  .add('regular', () => <Button>Hello Button</Button>)
  .add('cta', () => <Button type="cta">CTA Button</Button>)
  .add('small', () => <Button size="small">Small Button</Button>)
  .add('tertiary', () => (
    <Button type="tertiary" size="small">
      Tertiary (Small) Button
    </Button>
  ))
  .add('danger zone', () => (
    <Button type="dangerZone" size="small">
      Destructive Action
    </Button>
  ));

storiesOf('TooltipContainer', module)
  .add('action', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm an action tooltip" />
    </div>
  ))
  .add('info', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an info tooltip"
      />
    </div>
  ))
  .add('persistent', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm a persistent tooltip"
        persistent
      />
    </div>
  ))
  .add('left and top aligned', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm a tooltip" align={['top', 'left']} />
    </div>
  ));

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

storiesOf('Text', module)
  .add('regular ', () => <Text>Regular, 20px</Text>);

storiesOf('Markdown', module)
  .add('regular', () => <Markdown>Some __Markdown__</Markdown>)
  .add('truncated', () => <Markdown length={35}>35 characters of rendered __Markdown__ (and a little **more**)</Markdown>);

storiesOf('Badge', module)
  .add('regular', () => <Badge>Regular</Badge>)
  .add('success', () => <Badge type="success">Success</Badge>)
  .add('warning', () => <Badge type="warning">Warning</Badge>)
  .add('error', () => <Badge type="error">Error</Badge>);

storiesOf('Segmented-Buttons', module)
  .add('regular', () => <SegmentedButtons buttons={[{contents: 1}, {contents: 2}, {contents: 3}]} />)
  .add('jsx contents', () => <SegmentedButtons 
                               buttons={[
                                {contents:<><Badge>Normal</Badge> Badge</>}, 
                                {contents:<><Badge type="error">Error</Badge> Badge</>}
                                ]}
                             />
  );