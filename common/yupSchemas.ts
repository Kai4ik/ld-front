import * as Yup from "yup";
import { User, UserLogin } from "./types";

export const UserSchema: Yup.Schema<User> = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required field"),
  role: Yup.string()
    .oneOf(["seller", "buyer"] as const, "Must be either seller or buyer")
    .required("Required field"),
  password: Yup.string()
    .min(8, "Password is too short (at least 8 characters)")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Required field"),
});

export const UserLoginSchema: Yup.Schema<UserLogin> = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required field"),
  password: Yup.string()
    .min(8, "Password is too short (at least 8 characters)")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Required field"),
});
