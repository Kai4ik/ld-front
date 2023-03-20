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
  Select,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState, useEffect, use } from "react";

import { useRouter } from "next/navigation";

// internal modules
import { User } from "@/common/types";
import { UserSchema } from "@/common/yupSchemas";
import { createAccount } from "@/utils/auth";

export default function Register(): JSX.Element {
  const router = useRouter();
  const [username, setUsername] = useState("undefined");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema: UserSchema,
    onSubmit: (values: User) => {
      use(createAccount(values, formik, setUsername));
    },
  });

  useEffect(() => {
    if (username !== "undefined") {
      router.push(`/confirmation/${username}`);
    }
  }, [router, username]);

  return (
    <Center h="100vh" pb={20}>
      <VStack justify="center" spacing={[50, 10, 50]} color="main" w="40%">
        <Text fontSize="2xl" fontWeight="600">
          Create Account
        </Text>

        <form onSubmit={formik.handleSubmit} style={{ width: "90%" }}>
          <VStack w="100%" spacing={[12, 8, 12]}>
            <VStack w="100%" spacing={3}>
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
              <FormControl
                isInvalid={Boolean(formik.errors.role) && formik.touched.role}
              >
                <Select
                  name="role"
                  placeholder="Role"
                  variant="flushed"
                  colorScheme="purple"
                  focusBorderColor="secondary"
                  size="lg"
                  onChange={formik.handleChange}
                  value={formik.values.role}
                >
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                </Select>
                <FormErrorMessage>{formik.errors.role}</FormErrorMessage>
              </FormControl>
            </VStack>
            <Button type="submit" colorScheme="purple" width="full" mt="350px">
              Register
            </Button>
          </VStack>
        </form>
      </VStack>
    </Center>
  );
}
