// external modules
import { FormikProps } from "formik";
import { Dispatch, SetStateAction } from "react";

import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession,
  CookieStorage,
} from "amazon-cognito-identity-js";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// internal modules
import { User } from "@/common/types";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  Storage: new CookieStorage({
    domain: "localhost",
    expires: 1 / 24,
  }),
});

export async function createAccount(
  formData: User,
  formik: FormikProps<User>,
  setUsername: Dispatch<SetStateAction<string>>
): Promise<void> {
  const attributeList: CognitoUserAttribute[] = [];

  attributeList.push(
    new CognitoUserAttribute({
      Name: "custom:role",
      Value: formData["role"],
    })
  );

  userPool.signUp(
    formData.email,
    formData.password,
    attributeList,
    [],
    function (err, result) {
      if (err != null) {
        formik.setErrors({ email: err.message });
      } else {
        const cognitoUser = result?.user;
        setUsername(
          cognitoUser?.getUsername() != null
            ? cognitoUser.getUsername()
            : "undefined"
        );
      }
    }
  );
}

export async function confirmAccount(
  username: string,
  code: string,
  setConfirmed: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: decodeURIComponent(username).replace(/\+/g, " "),
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(code, false, function (err) {
    if (err != null) {
      console.log(err.message);
    } else {
      setConfirmed(true);
    }
  });
}

export async function resendConfirmationCode(
  username: string,
  setCodeSent: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: decodeURIComponent(username).replace(/\+/g, " "),
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.resendConfirmationCode(function (err) {
    if (err != null) {
      console.log(err.message);
    } else {
      setCodeSent(true);
    }
  });
}

export async function authenticateUser(
  username: string,
  password: string,
  formik: FormikProps<{ email: string; password: string }>,
  setLoggedIn: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: username,
    Pool: userPool,
    Storage: new CookieStorage({
      domain: "localhost",
      expires: 1 / 24,
    }),
  };

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function () {
      setLoggedIn(true);
    },

    onFailure: function (err) {
      if (err.message === "User does not exist.") {
        formik.setErrors({ email: err.message });
      } else {
        formik.setErrors({ password: "Incorrect password" });
      }
    },
  });
}

export async function verifyUser(token: string) {
  const response = { succcess: true, error_message: "", payload: "" };
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    tokenUse: "id",
    clientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
  });

  try {
    const payload = await verifier.verify(token);
    response.payload = JSON.stringify(payload);
  } catch (e) {
    if (e instanceof Error) {
      response.error_message = e.message;
    }
    response.succcess = false;
  }
  return response;
}

export function getUsernameAndRole(payload: string) {
  const parsedData = JSON.parse(payload);
  return { email: parsedData.email, role: parsedData["custom:role"] };
}
