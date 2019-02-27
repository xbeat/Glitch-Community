import React from "react";
import { storiesOf } from "@storybook/react";
import Button from "../src/components/buttons/button";
import TooltipContainer from "../src/components/tooltip-container";

storiesOf("Button", module)
  .add("regular", () => <Button>Hello Button</Button>)
  .add("cta", () => <Button type="cta">CTA Button</Button>)
  .add("small", () => <Button size="small">Small Button</Button>)
  .add("tertiary", () => (
    <Button type="tertiary" size="small">
      Tertiary (Small) Button
    </Button>
  ))
  .add("danger zone", () => (
    <Button type="dangerZone" size="small">
      Destructive Action
    </Button>
  ));

storiesOf("TooltipContainer", module)
  .add("action", () => (
    <TooltipContainer
      type="action"
      id="a-unique-id"
      target={<Button>Hover or focus me</Button>}
      tooltip="I'm an action tooltip"
    />
  ))
  .add("information", () => (
    <TooltipContainer
      type="information"
      id="a-unique-id"
      target={
        <img
          style={{margin: '100px', width: '32px', height: '32px'}}
          src="https://favicon-fetcher.glitch.me/img/glitch.com"
        />
      }
      tooltip="I'm an information tooltip"
    />
  ))
  .add("persistent", () => (
    <TooltipContainer
      type="information"
      id="a-unique-id"
      target={
        <img
          style={{margin: '100px', width: '32px', height: '32px'}}
          src="https://favicon-fetcher.glitch.me/img/glitch.com"
        />
      }
      tooltip="I'm a persistent tooltip"
      persistent
    />
  ))
  .add("left and top aligned", () => (
    <TooltipContainer
      type="action"
      id="a-unique-id"
      target={<Button style={{margin: '100px'}}>Hover or focus me</Button>}
      tooltip="I'm a tooltip"
      align={["top", "left"]}
    />
  ))
  .add("with children", () => (
    <TooltipContainer
      type="action"
      id="a-unique-id"
      target={<Button >Hover or focus me</Button>}
      tooltip="I'm a tooltip"
    >
      <p>I'm the <code>props.children</code></p>
  </TooltipContainer>
  ));
