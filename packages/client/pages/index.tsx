import React from "react";
import { NextPage } from "next";
import { CurrentUserData } from "./_app";

interface Props {
  currentUser?: CurrentUserData;
}

const LandingPage: NextPage<Props> = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

export default LandingPage;
