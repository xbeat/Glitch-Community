import React from "react";
import { storiesOf } from "@storybook/react";
import Button from "../src/components/buttons/button";
import TooltipContainer from "../src/components/tooltips/tooltip-container";

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
        target={<Button>Hover or focus me</Button>}
        tooltip="I'm an action tooltip"
      />
    </div>
  ))
  .add("info", () => (
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an info tooltip"
      />
    </div>
  ))
  .add("persistent", () => (
    <div style={{margin: '70px'}}>
      <TooltipContainer
        type="info"
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
  ));
