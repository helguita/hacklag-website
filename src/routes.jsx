/* eslint-disable */
import React from 'react';
import Router from 'react-router-old';

// Pages
import AppPage from './pages/app.react';
import NotFoundPage from './pages/notfound.react';
import CounterPage from './pages/counter.react';
import TemperaturePage from './pages/temperature.react.jsx';

// Apps
import Counter from './apps/Counter';
import Temperature from './apps/Temperature';

const Route = Router.Route;
const Redirect = Router.Redirect;
const NotFoundRoute = Router.NotFoundRoute;
const DefaultRoute = Router.DefaultRoute;

export default (
  <Route
    name="app"
    handler={AppPage}
    path="/"
    >
    <NotFoundRoute handler={NotFoundPage}/>
    
    {/* Example created page */}
      <Route
        name="counter"
        handler={CounterPage}
        >
        <NotFoundRoute handler={NotFoundPage}/>
        <Route
          name="Forward"
          handler={Counter.Forward}
          />
          <Route
          name="Reverse"
          handler={Counter.Reverse}
          />
        <DefaultRoute handler={CounterPage}/>
      </Route>
	{/* Temperature */}
      <Route
        name="temperature"
        handler={TemperaturePage}
        path="temperature"
        >
        <DefaultRoute handler={Temperature}/>
      </Route>

      <DefaultRoute handler={CounterPage}/>
  </Route>
);
