import React from 'react';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

import {getEditorUrl} from '../../models/project';
import {CurrentUserProvider, CurrentUserConsumer} from '../current-user.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';
import WhatIsGlitch from '../what-is-glitch.jsx';

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
    <p>
      Of course, this site was made on Glitch too{' '}
      <a href={getEditorUrl('community')} className="button button-link has-emoji">
        View Source <span className="emoji carp_streamer"></span>
      </a>
    </p>
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

const IndexPageContainer = ({userModel, ...props}) => (
  <CurrentUserProvider model={userModel}>
    <CurrentUserConsumer>
      {user => <IndexPage user={user} {...props}/>}
    </CurrentUserConsumer>
    <script src="//fast.wistia.com/embed/medias/vskja9agqj.jsonp" async/>
    <script src="//fast.wistia.com/assets/external/E-v1.js" async/>
  </CurrentUserProvider>
);

export default function IndexPagePresenter(application) {
  const props = {
    api: application.api(),
    categories: application.categories,
    userModel: application.currentUser(),
  };
  const content = Reactlet(IndexPageContainer, props);
  return LayoutPresenter(application, content);
}