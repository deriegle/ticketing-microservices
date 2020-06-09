import React from "react";
import { NextPage } from "next";
import buildClient from "../api/build-client";

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

LandingPage.getInitialProps = async (
  context
): Promise<{ currentUser?: CurrentUserData }> => {
  try {
    const data: {
      currentUser: {
        userId: string;
        email: string;
        iat: number;
      };
    } = await buildClient(context).get("/api/users/currentuser");

    console.log({ data });

    return data;
  } catch (err) {
    console.log("error fetching data", err);
    return {};
  }
};

export default LandingPage;
