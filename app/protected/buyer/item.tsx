"use client";

// external modules
import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  VStack,
  HStack,
  Stack,
  Button,
  AccordionPanel,
} from "@chakra-ui/react";
import { Item } from "@/common/types";
import { AddIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {
  items: Item[];
};

export default function Items({ items }: Props): JSX.Element {
  const [initialItems, setInitialItems] = useState(items);
  const router = useRouter();
  const currentlyInCart = initialItems.filter(
    (item) => item.inCart === true
  ).length;

  const placeOrder = async () => {
    const allCookies = Cookies.get();
    let token = "";

    for (const [key, value] of Object.entries(allCookies)) {
      if (key.includes("idToken")) token = value;
    }

    const itemsInCart: string[] = [];
    initialItems.forEach((item) => {
      if (item.inCart === true) itemsInCart.push(item.id);
    });
    console.log(token);

    const creationResult = await axios.post(
      `http://localhost:8080/v1/api/orders`,
      {
        itemsIDs: itemsInCart,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (creationResult.status === 201) {
      const filteredArray = initialItems.filter(
        (elem) => !itemsInCart.includes(elem.id)
      );
      setInitialItems(filteredArray);
    }
  };

  const cartOperations = (operation: string, item: Item) => {
    const modifiedArray = initialItems.map((elem) => {
      if (elem.id === item.id) {
        elem.inCart = operation === "add" ? true : false;
      }
      return elem;
    });
    setInitialItems(modifiedArray);
  };

  return (
    <VStack p={5} m="auto" w="90%">
      <Text
        alignSelf="flex-start"
        fontSize={18}
        color="secondary"
        fontWeight={600}
      >
        All items for sale
      </Text>
      {initialItems.length > 0 ? (
        <>
          <Text
            alignSelf="flex-start"
            fontSize={16}
            color="main"
            fontWeight={500}
          >
            Currently in your cart: {currentlyInCart}
          </Text>

          <Accordion w="100%" allowMultiple>
            {initialItems.map((item) => (
              <AccordionItem
                border="1px"
                borderColor="gray.300"
                borderRadius={8}
                mb="20px"
                key={item.id}
              >
                <AccordionButton
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row"
                >
                  <Stack
                    direction={["column", "row"]}
                    justify="space-between"
                    w="95%"
                  >
                    <VStack align="flex-start">
                      <HStack>
                        <Text fontWeight={600} color="main">
                          Title:
                        </Text>
                        <Text> {item.itemTitle}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight={600} color="main">
                          Price
                        </Text>
                        <Text> ${item.itemPrice}</Text>
                      </HStack>
                    </VStack>
                    <HStack spacing={20}>
                      <HStack>
                        <Text fontWeight={600} color="main">
                          Sold By:
                        </Text>
                        <Text> {item.soldBy}</Text>
                      </HStack>
                    </HStack>
                  </Stack>

                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={8} align="flex-start">
                    <Text> {item.itemDescription}</Text>
                    <HStack w="100%" p="0 1%" justify="flex-end">
                      <Button
                        alignSelf="flex-end"
                        colorScheme="yellow"
                        w="15%"
                        leftIcon={<AddIcon />}
                        isDisabled={item.inCart}
                        onClick={() => cartOperations("add", item)}
                      >
                        Add to cart
                      </Button>
                      <Button
                        alignSelf="flex-end"
                        colorScheme="red"
                        w="15%"
                        leftIcon={<DeleteIcon />}
                        isDisabled={!item.inCart}
                        onClick={() => cartOperations("remove", item)}
                      >
                        Remove from cart {item.inCart}
                      </Button>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <Button
            colorScheme="green"
            size="lg"
            w="20%"
            onClick={placeOrder}
            isDisabled={currentlyInCart === 0}
          >
            Place an order
          </Button>
        </>
      ) : (
        <Text
          fontSize={18}
          color="main"
          fontWeight={600}
          alignSelf="flex-start"
        >
          No items for sale yet! Check later
        </Text>
      )}
    </VStack>
  );
}
