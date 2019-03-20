import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './emoji.styl';

const cx = classNames.bind(styles);

const emojiMap = {
  ambulance: 'https://cdn.glitch.com/cc880f8d-a84f-4909-b676-497522a8c625%2Fambulance.png?1522348095546',
  arrowDown: 'https://cdn.glitch.com/20b03a49-e2c4-45fb-b411-c56cf5a734d4%2Farrow-down.png?1544196625027',
  balloon: 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fballoon.png',
  bentoBox: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743',
  bomb: 'https://cdn.glitch.com/f34c5d19-c958-40f6-b11f-7a4542a5ae5f%2Fbomb.png?1516646116574',
  bouquet: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fbouquet.png?1541454729552',
  carpStreamer: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fcarp_streamer.png?1495811307116',
  clapper: 'https://cdn.glitch.com/25a45fb6-d565-483a-87d2-f944befeb36b%2Fclapper.png?1547651495960',
  creditCard: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fcredit-card.png?1531500270157',
  diamondSmall: 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fdiamond-small.svg?1521574997856',
  dogFace: 'https://cdn.glitch.com/03736932-82dc-40e8-8dc7-93330c933143%2Fdog-face.png?1518194896589',
  email: 'https://cdn.glitch.com/aebac4f9-ae14-4d54-aa60-de46dac3b603%2Femail.png?1544048218028',
  eyes: 'https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Feyes.png?1507674700306',
  facebook: 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffacebook-logo.png',
  fastDown: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffast_down.png?1531842090363',
  fastUp: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffast_up.png?1531842090613',
  fishingPole: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Ffishing_pole.png?1503525896764',
  framedPicture: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fframed_picture.png?1496341054682',
  herb: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fherb.png?1530822265585',
  microphone: 'https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Fmicrophone.png?1507674704246',
  octocat: 'https://gomix.com/images/emojis/github-logo-light.svg',
  park: 'https://cdn.glitch.com/4f4a169a-9b63-4daa-8b6a-0e50d5c06e25%2Fnational-park_1f3de.png?1545249042752',
  pushpin: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpushpin.png?1500918744339',
  rainbow: 'https://cdn.glitch.com/e5154318-7816-4ec9-a72a-a0e767031e99%2Frainbow.png?1533590257352',
  sick: 'https://cdn.glitch.com/4f4a169a-9b63-4daa-8b6a-0e50d5c06e25%2Fface-with-thermometer_1f912.png?1545248970931',
  sparkles: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkles.png?1494859430570',
  sparklingHeart: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkling_heart.png?1496347645716',
  sunglasses: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg',
  thumbsDown: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fthumbs_down.png?1503415943993',
  thumbsUp: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fthumbs-up.png?1530883108902',
  wave: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png?1502123444938',
};

/**
 * Emoji Component
 */

const Emoji = ({ name }) => {
  const classNameObj = { emoji: true };
  classNameObj[name] = true;

  const className = cx(classNameObj);

  return <img className={className} src={emojiMap[name]} alt={name} />;
};

Emoji.propTypes = {
  /** element(s) to display in the button */
  name: PropTypes.oneOf(Object.keys(emojiMap)).isRequired,
};

export default Emoji;