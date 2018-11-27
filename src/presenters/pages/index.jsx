import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {CurrentUserConsumer} from '../current-user.jsx';
import Link from '../includes/link.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import OverlayVideo from '../overlays/overlay-video.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}


const Dots = () => (
  <>
    <div className="dot green"></div>
    <div className="dot yellow"></div>
    <div className="dot red"></div>
  </>
);

  
class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    const kiki = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-kiki-illustration.svg?1543270677099"
    
    const discover = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fdiscover-illustration.svg?1543271788169";
    const remix = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fremix-illustration.svg?1543270676664";
    const collaborate = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fcollaborate-illustration.svg?1543270676514";
    
    const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981";
    const play = "https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761";
    const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667";
    const whatsGlitchAlt = "Glitch is the friendly community for building the app of your dreams";
    
    return (
      <section className="what-is-glitch">
        <span>
          <figure title="Glitch">
            <img className="kiki" src={kiki} alt={whatsGlitchAlt}/>
            <h1>
              <span>Glitch is the</span><br/>
              <span style={{color: "#69E4CA"}}>friendly community</span><br/>
              <span>where you'll build the</span><br/>
              <span style={{color: "#9FD6FF"}}>app of your dreams</span><br/>
            </h1>
          </figure>
          
          <div className="callouts">
            
            <div className="callout discover">
              <img className="badge" src={discover}>
              </img>
              <div className="window">
                <div className="title">
                  Explore 
                  <Dots/>
                </div>
                <div className="description">
                  Discover over a million free apps built by our community
                </div>
              </div>
            </div>
            
            <div className="callout remix">
              <img className="badge" src={remix}>
              </img>
              <div className="window">
                <div className="title">
                  Remix
                  <Dots/>
                </div>
                <div className="description">
                  Remix anything you find and edit it to make it your own
                </div>
              </div>
            </div>
            
            {/*
            <div className="callout collaborate">
              <img className="badge" src={collaborate}>
              </img>
              <div className="window">
                <div className="title">
                  Collaborate
                  <Dots/>
                </div>
                <div className="description">
                  Invite your whole team to build projects together
                </div>
              </div>
            </div>
            */}
            
          </div>
          
          {/*
          <div>
            And it's <img className="free" src={free} alt="free"/>.{' '}
            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="play"/>
                <span>How it works in 1 minute</span>
              </div>
            </OverlayVideo>
          </div>
          */}
          
        </span>
      </section>
    );
  }
}

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer"></span>
    </Link>
  </section>
);

const IndexPage = ({api, user}) => (
  <main>
    {!user.login && <WhatIsGlitch/>}
    
    {user.login && 
      <h1 className="headline">
        <Link to="https://glitch.com">Glitch</Link>{' '}
        is the friendly community where everyone can discover & create the best stuff on the web
      </h1>
    }
    
    {!!user.login && <Questions api={api}/>}
    {!!user.projects.length && <RecentProjects api={api}/>}
    <Featured/>
    <RandomCategories api={api}/>
    <Categories/>
    <MadeInGlitch/>
  </main>
);
IndexPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }),
};

const IndexPageContainer = ({api}) => (
  <Layout api={api}>
    <CurrentUserConsumer>
      {user => <IndexPage api={api} user={user}/>}
    </CurrentUserConsumer>
  </Layout>
);

export default IndexPageContainer;
