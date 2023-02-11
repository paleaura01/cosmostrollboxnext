import React from "react";
import { Router, Route, Link, withRouter } from "next/router";
import SignIn from "src/components/signin.js";
import TrollBox from "src/components/trollbox.js";

const routes = () => (
  <Router>
    <Route path="/" component={SignIn} />
    <Route path="/trollbox" component={TrollBox} />
</Router>
);

export default routes;