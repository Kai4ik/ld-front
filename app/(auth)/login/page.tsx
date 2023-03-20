"use client";

// external modules
import {
  Center,
  VStack,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import * as jose from "jose";

// internal modules
import { authenticateUser, getUsernameAndRole } from "@/utils/auth";
import { UserLoginSchema } from "@/common/yupSchemas";

export default function Login(): JSX.Element {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: UserLoginSchema,
    onSubmit: async (values) => {
      await authenticateUser(
        values.email,
        values.password,
        formik,
        setLoggedIn
      );
    },
  });

  useEffect(() => {
    if (loggedIn) {
      const allCookies = Cookies.get();
      let token = "";

      for (const [key, value] of Object.entries(allCookies)) {
        if (key.includes("idToken")) token = value;
      }

      const userAndRole = getUsernameAndRole(
        JSON.stringify(jose.decodeJwt(token))
      );

      router.push(
        userAndRole.role === "seller" ? "/protected/seller" : "protected/buyer"
      );
    }
  }, [router, loggedIn]);

  return (
    <Center h="100vh" pb={20}>
      <VStack
        justify={["flex-start", "center"]}
        spacing={50}
        color="main"
        h="100%"
        w="50%"
      >
        <Text fontSize="2xl" fontWeight="600">
          Welcome back!
        </Text>
        <form onSubmit={formik.handleSubmit} style={{ width: "60%" }}>
          <VStack w="100%" spacing={12}>
            <VStack w="100%" spacing={2}>
              <FormControl
                isInvalid={Boolean(formik.errors.email) && formik.touched.email}
              >
                <Input
                  name="email"
                  type="email"
                  variant="flushed"
                  placeholder="Email"
                  size="lg"
                  focusBorderColor="secondary"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  Boolean(formik.errors.password) && formik.touched.password
                }
              >
                <Input
                  name="password"
                  type="password"
                  variant="flushed"
                  placeholder="Password"
                  size="lg"
                  focusBorderColor="secondary"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
            </VStack>
            <Button type="submit" colorScheme="purple" width="full" mt="350px">
              Login
            </Button>
          </VStack>
        </form>
      </VStack>
    </Center>
  );
}
