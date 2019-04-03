import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import TextInput from 'Components/inputs/text-input';
import TextArea from 'Components/inputs/text-area';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Markdown from 'Components/text/markdown';
import Badge from 'Components/badges/badge';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Embed from 'Components/project/embed';
import ProjectEmbed from 'Components/project/project-embed';
import { CurrentUserProvider } from '../src/state/current-user';

const helloAlert = () => {
  alert('hello');
};

const withState = (initState, Component) => {
  const WrappedComponent = () => {
    const [state, setState] = useState(initState);
    return <Component state={state} setState={setState} />;
  }
  return () => <WrappedComponent />;
};

storiesOf('Button', module)
  .add('regular', () => <Button onClick={helloAlert}>Hello Button</Button>)
  .add('cta', () => (
    <Button type="cta" onClick={helloAlert}>
      CTA Button
    </Button>
  ))
  .add('small', () => (
    <Button size="small" onClick={helloAlert}>
      Small Button
    </Button>
  ))
  .add('tertiary', () => (
    <Button type="tertiary" size="small" onClick={helloAlert}>
      Tertiary (Small) Button
    </Button>
  ))
  .add('danger zone (red on hover)', () => (
    <Button type="dangerZone" size="small" onClick={helloAlert}>
      Destructive Action
    </Button>
  ))
  .add('link (click to a different page)', () => <Button href="https://support.glitch.com">Support</Button>)
  .add('with emoji', () => (
    <Button onClick={helloAlert}>
      <Emoji name="sunglasses" /> Show
    </Button>
  ))
  .add(`match background`, () => (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#F5F5F5' }}>
      <Button onClick={helloAlert} matchBackground={true}>
        Support <Emoji name="ambulance" />
      </Button>
    </div>
  ));

storiesOf('Emoji', module)
  .add('standard', () => <Emoji name="herb" />)
  .add('sunglasses', () => <Emoji name="sunglasses" />);

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

storiesOf('Image', module)
  .add('regular', () => <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />)
  .add('background Image', () => (
    <Image backgroundImage={true} src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />
  ))
  .add('srcSet', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg"
      srcSet={[
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg?x=2 1000w',
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg?x=1 2000w',
      ]}
      alt="Glitch Logo"
    />
  ))
  .add('width & height', () => (
    <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" width="200" height="200" />
  ))
  .add('width & height with background image', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg"
      backgroundImage
      alt="Glitch Logo"
      width="200px"
      height="200px"
    />
  ));
storiesOf('Heading', module)
  .add('h1 ', () => <Heading tagName="h1">H1, 22px</Heading>)
  .add('h2', () => <Heading tagName="h2">H2, 18px</Heading>)
  .add('h3', () => <Heading tagName="h3">H3, 16px</Heading>)
  .add('h4', () => <Heading tagName="h4">H4, 14px</Heading>);

storiesOf('Text', module).add('regular ', () => <Text>Regular, 20px</Text>);

storiesOf('Markdown', module)
  .add('regular', () => <Markdown>Some __Markdown__</Markdown>)
  .add('truncated', () => <Markdown length={35}>35 characters of rendered __Markdown__ (and a little **more**)</Markdown>);

storiesOf('Badge', module)
  .add('regular', () => <Badge>Regular</Badge>)
  .add('success', () => <Badge type="success">Success</Badge>)
  .add('warning', () => <Badge type="warning">Warning</Badge>)
  .add('error', () => <Badge type="error">Error</Badge>);

storiesOf('Segmented-Buttons', module)
  .add(
    'regular',
    withState('a', ({ state, setState }) => (
      <SegmentedButtons
        value={state}
        onChange={setState}
        buttons={[{ name: 'a', contents: 1 }, { name: 'b', contents: 2 }, { name: 'c', contents: 3 }]}
      />
    )),
  )
  .add(
    'jsx contents',
    withState('a', ({ state, setState }) => (
      <SegmentedButtons
        value={state}
        onChange={setState}
        buttons={[
          {
            name: 'a',
            contents: (
              <>
                <Badge>Normal</Badge> Badge
              </>
            ),
          },
          {
            name: 'b',
            contents: (
              <>
                <Badge type="error">Error</Badge> Badge
              </>
            ),
          },
        ]}
      />
    )),
  );

storiesOf('Embed', module)
  .add('regular', () => <Embed domain="community-staging" />)

storiesOf('ProjectEmbed', module)
  .add('when authorized, it shows an "unfeature" button and an edit button', () => ( 
      <ProjectEmbed 
        isAuthorized
        unfeatureProject={alert.bind(this, "project un-featured would be called now")}
        featuredProject={{id: "123", domain: "community-staging" }}
        addProjectToCollection={alert.bind(this, "add project to collection would have been called now")}
      />
  ))
  .add('when unauthorized, it shows a report button', () => (
    <CurrentUserProvider>    
      <ProjectEmbed 
        isAuthorized={false}
        currentUser={{ login: null }}
        unfeatureProject={alert.bind(this, "project un-featured would be called now")}
        featuredProject={{id: "123", domain: "community-staging" }}
        addProjectToCollection={alert.bind(this, "add project to collection would have been called now")}
      />
    </CurrentUserProvider>
  ))
  .add('when passed a logged in user it shows a addProjectToCollection button and a remix this button', () => (
    <ProjectEmbed 
      isAuthorized={false}
      currentUser={{ login: "@sarahzinger" }}
      unfeatureProject={alert.bind(this, "project un-featured would be called now")}
      featuredProject={{id: "123", domain: "community-staging" }}
      addProjectToCollection={alert.bind(this, "add project to collection would have been called now")}
    />
  ))
  .add('when not passed a logged in user it shows a addProjectToCollection button and a remix your own button', () => (
    <CurrentUserProvider>    
      <ProjectEmbed 
        isAuthorized={false}
        currentUser={{ login: null }}
        unfeatureProject={alert.bind(this, "project un-featured would be called now")}
        featuredProject={{id: "123", domain: "community-staging" }}
        addProjectToCollection={alert.bind(this, "add project to collection would have been called now")}
      />
    </CurrentUserProvider>
  ))