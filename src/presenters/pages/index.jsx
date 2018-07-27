import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {CurrentUserProvider, CurrentUserConsumer} from '../current-user.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import OverlayVideo from '../overlays/overlay-video.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';

const play = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761";
const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667";
const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981";

const whatsGlitchAlt = "Create a node app, or remix one. It updates as you type. Code with Friends!";

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}
  
class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/vskja9agqj.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    return (
      <section className="what-is-glitch">
        <h2>How It Works</h2>
        <span>
          <a href="https://glitch.com/about">
            <figure title="How Glitch works">
              <img className="wide" src={whatsGlitchWide} alt={whatsGlitchAlt}/>
              <img className="narrow" src={whatsGlitchNarrow} alt={whatsGlitchAlt}/>
            </figure>
          </a>
          <div>
            And it's <img className="free" src={free} alt="free"/>.{' '}
            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="play"/>
                <span>How it works in 1 minute</span>
              </div>
            </OverlayVideo>
          </div>
        </span>
      </section>
    );
  }
}

const FOUNDED = 2000;
const current = new Date().getFullYear();
const age = current - FOUNDED;
const logo = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffogcreek.svg";

const ByFogCreek = () => (
  <section className="by-fogcreek" role="complementary">
    <h2>Made By Fog Creek</h2>
    <img src={logo} alt="Fog Creek logo"/>
    <p>
      You might know us for making Trello, FogBugz, and co-creating Stack Overflow. 
      We're <a href="https://www.fogcreek.com">a friendly, self-funded company</a> that's
      been helping people make stuff for over {age} years.
    </p>
  </section>
);

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <a href={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer"></span>
    </a>
  </section>
);

const IndexPage = ({api, categories, user}) => (
  <main>
    <h1 className="headline">
      <a href="https://glitch.com">Glitch</a>{' '}
      is the friendly community where you'll build the app of your dreams
    </h1>
    {!!user.login && <Questions api={api}/>}
    {!!user.id && <RecentProjects api={api}/>}
    <Featured/>
    <RandomCategories api={api}/>
    <Categories categories={categories}/>
    {!user.login && <WhatIsGlitch/>}
    <ByFogCreek/>
    <MadeInGlitch/>
  </main>
);
IndexPage.propTypes = {
  api: PropTypes.any.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }).isRequired,
};

const IndexPageContainer = ({application}) => (
  <Layout application={application}>
    <CurrentUserProvider model={application.currentUser()}>
      <CurrentUserConsumer>
        {user => <IndexPage user={user} api={application.api()} categories={application.categories}/>}
      </CurrentUserConsumer>
    </CurrentUserProvider>
  </Layout>
);

export default IndexPageContainer;