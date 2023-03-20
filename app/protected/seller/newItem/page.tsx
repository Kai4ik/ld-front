"use client";

// external modules
import {
  Center,
  VStack,
  Text,
  Input,
  Textarea,
  FormControl,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";

export default function Login(): JSX.Element {
  const router = useRouter();
  const { register, handleSubmit, getValues, reset, control } = useForm();

  const onSubmit = async (): Promise<void> => {
    const itemData = getValues();
    itemData.itemStatus = "on sale";

    const allCookies = Cookies.get();
    let token = "";

    for (const [key, value] of Object.entries(allCookies)) {
      if (key.includes("idToken")) token = value;
    }

    const itemCreationResult = await axios.post(
      `http://localhost:8080/v1/api/items`,
      itemData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const status = itemCreationResult.data.status;
    if (status === "success") {
      router.push("/protected/seller");
    }
  };

  return (
    <Center h="100vh" pb={20}>
      <VStack
        justify={["flex-start", "center"]}
        spacing={50}
        color="main"
        h="100%"
        w="70%"
      >
        <Text fontSize="2xl" fontWeight="600">
          New Item
        </Text>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "60%" }}>
          <VStack w="100%" spacing={12}>
            <VStack w="100%" spacing={6}>
              <FormControl>
                <Input
                  type="text"
                  variant="outline"
                  placeholder="Item Title"
                  size="lg"
                  focusBorderColor="secondary"
                  {...register("itemTitle", {
                    required: true,
                  })}
                />
              </FormControl>
              <FormControl>
                <Textarea
                  variant="outline"
                  placeholder="Item Description"
                  size="lg"
                  focusBorderColor="secondary"
                  {...register("itemDescription", {
                    required: true,
                  })}
                />
              </FormControl>
              <FormControl>
                <Controller
                  control={control}
                  name="itemPrice"
                  defaultValue={0.0}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <NumberInput {...field} precision={2} step={0.1} min={0.0}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
              </FormControl>
            </VStack>
            <Button type="submit" colorScheme="purple" width="full" mt="350px">
              Submit
            </Button>
          </VStack>
        </form>
      </VStack>
    </Center>
  );
}
