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
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="action"
        id="a-unique-id"
        target={<button>Hover or focus me</button>}
        tooltip="I'm an action tooltip"
      />
    </div>
  ))
  .add("information", () => (
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="information"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an information tooltip"
      />
    </div>
  ))
  .add("persistent", () => (
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="information"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm a persistent tooltip"
        persistent
      />
    </div>
  ))
  .add("left and top aligned", () => (
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="action"
        id="a-unique-id"
        target={<Button>Hover or focus me</Button>}
        tooltip="I'm a tooltip"
        align={["top", "left"]}
      />
    </div>
  ))
  .add("with children", () => (
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="action"
        id="a-unique-id"
        target={<Button>Hover or focus me</Button>}
        tooltip="I'm a tooltip"
      >
        <p>I'm the <code>props.children</code></p>
      </TooltipContainer>
    </div>
  ));
