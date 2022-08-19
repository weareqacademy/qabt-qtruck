import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Map from './pages/Map';
import Item from './pages/Item';
import Create from './pages/Create';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/signup" exact component={Signup} />

        <Route path="/map" component={Map} />
        <Route path="/foodtrucks/create" component={Create} />
        <Route path="/foodtrucks/:id" component={Item} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;