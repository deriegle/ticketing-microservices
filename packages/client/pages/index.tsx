import React from "react";
import { NextPage } from "next";

interface CurrentUserData {
  userId: string;
  email: string;
  iat: number;
}

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
