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
  AccordionPanel,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { Order } from "@/common/types";

import { useState } from "react";

type Props = {
  orders: Order[];
};

export default function Orders({ orders }: Props): JSX.Element {
  const [initialOrders, setInitialORders] = useState(orders);

  return (
    <VStack p={5} m="auto" w="90%">
      <Text
        alignSelf="flex-start"
        fontSize={18}
        color="secondary"
        fontWeight={600}
      >
        All your past orders
      </Text>
      {initialOrders.length > 0 ? (
        <>
          <Text
            alignSelf="flex-start"
            fontSize={16}
            color="main"
            fontWeight={500}
          >
            Total orders: {initialOrders.length}
          </Text>

          <Accordion w="100%" allowMultiple>
            {initialOrders.map((order) => (
              <AccordionItem
                border="1px"
                borderColor="gray.300"
                borderRadius={8}
                mb="20px"
                key={order.id}
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
                          Date:
                        </Text>
                        <Text>
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US"
                          )}
                        </Text>
                      </HStack>
                    </VStack>
                  </Stack>

                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <TableContainer w="100%">
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Title</Th>
                          <Th>Description</Th>
                          <Th isNumeric>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {order.items.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.itemTitle}</Td>
                            <Td>{item.itemDescription}</Td>
                            <Td isNumeric>{item.itemPrice}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ) : (
        <Text
          fontSize={18}
          color="main"
          fontWeight={600}
          alignSelf="flex-start"
        >
          You did not make any orders yet!
        </Text>
      )}
    </VStack>
  );
}
