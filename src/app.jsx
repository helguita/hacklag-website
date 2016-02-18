import 'babel-core/polyfill';
import 'normalize.css';
import './app.sass';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, History, IndexRoute} from 'react-router';
import {createHistory, useBasename} from 'history';

// Frameworks
import './framework/raven';
import './framework/segment';

// Pages
import AppPage from './pages/app.react';
import NotFoundPage from './pages/notfound.react';

// Page components
import {
  Home,
  About,
  Blog,
  Community,
  Events,
  Gallery,
  Partners
} from './apps/Pages';

// Apps
import Test from './apps/Test';

const history = useBasename(createHistory)({
  basename: '/dashboard'
});

render(
  <Router>
    <Route component={AppPage}>
      <Route path="/" component={Home}/>
      <Route path="news" component={Home.News}/>
      <Route path="becomeamember" component={Home.BecomeAMember}/>
      <Route path="agreement" component={Home.Agreement}/>

      <Route path="about" component={About}>
        <Route path="contact" component={About.Contact}/>
        <Route path="faq" component={About.FAQ}/>
        <Route path="place" component={About.Place}/>
      </Route>

      <Route path="blog" component={Blog}/>

      <Route path="community" component={Community}>
        <Route path="agreement" component={Community.Agreement}/>
        <Route path="clubs" component={Community.Clubs}/>
        <Route path="hydepark" component={Community.Hydepark}/>
        <Route path="join" component={Community.Join}/>
        <Route path="registration" component={Community.Registration}/>
      </Route>

      <Route path="events" component={Events}>
        <Route path="calendar" component={Events.Calendar}/>
      </Route>

      <Route path="gallery" component={Gallery}/>

      <Route path="partners" component={Partners}>
        <Route path="donate" component={Partners.Donate}/>
        <Route path="agreement" component={Partners.Agreement}/>
      </Route>

      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
