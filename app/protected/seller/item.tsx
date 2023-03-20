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
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {
  items: Item[];
};

export default function Items({ items }: Props): JSX.Element {
  const [deletionInProgress, setDeletionInProgress] = useState<boolean>(false);
  const [initialItems, setInitialItems] = useState(items);
  const router = useRouter();

  const handleDelete = async (itemID: string) => {
    const allCookies = Cookies.get();
    let token = "";

    for (const [key, value] of Object.entries(allCookies)) {
      if (key.includes("idToken")) token = value;
    }

    setDeletionInProgress(true);
    const deletionResult = await axios.delete(
      `http://localhost:8080/v1/api/items`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          itemID: itemID,
        },
      }
    );
    console.log(deletionResult);
    if (deletionResult.status === 204) {
      const filteredArray = initialItems.filter((elem) => elem.id !== itemID);
      setInitialItems(filteredArray);
    }
    setDeletionInProgress(false);
  };

  return (
    <VStack p={5} m="auto" w="90%">
      <Text
        alignSelf="flex-start"
        fontSize={18}
        color="secondary"
        fontWeight={600}
      >
        Your items for sale
      </Text>

      {initialItems.length > 0 ? (
        <>
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
                          Status:
                        </Text>
                        <Text> {item.itemStatus}</Text>
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
                        w="10%"
                        leftIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        alignSelf="flex-end"
                        colorScheme="red"
                        w="10%"
                        leftIcon={<DeleteIcon />}
                        onClick={() => handleDelete(item.id)}
                        isLoading={deletionInProgress}
                        loadingText="Deleting ..."
                      >
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <Button
            colorScheme="green"
            w="20%"
            leftIcon={<DeleteIcon />}
            onClick={() => router.push("/protected/seller/newItem")}
          >
            Add Item
          </Button>
        </>
      ) : (
        <VStack w="100%" align="flex-start" pt={2}>
          <Text fontSize={18} color="main" fontWeight={600}>
            No items yet. Want to add one?
          </Text>
          <Button
            colorScheme="green"
            w="20%"
            leftIcon={<DeleteIcon />}
            onClick={() => router.push("/protected/seller/newItem")}
          >
            Add Item
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
