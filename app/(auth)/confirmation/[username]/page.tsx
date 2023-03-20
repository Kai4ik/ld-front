"use client";

// external modules
import {
  Center,
  VStack,
  Text,
  PinInput,
  PinInputField,
  HStack,
  Link,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FocusableElement } from "@chakra-ui/utils";
import { useFormik } from "formik";
import { use, useState, useEffect, useRef, RefObject } from "react";
import { useRouter } from "next/navigation";

// internal modules
import { confirmAccount, resendConfirmationCode } from "@/utils/auth";

interface Props {
  params: {
    username: string;
  };
}

export default function ConfirmEmail({ params }: Props): JSX.Element {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as RefObject<FocusableElement>;

  const [confirmed, setConfirmed] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    onSubmit: (values) => {
      use(confirmAccount(params.username, values.code, setConfirmed));
    },
  });

  const formikResendCode = useFormik({
    initialValues: {},
    onSubmit: () => {
      use(resendConfirmationCode(params.username, setCodeSent));
    },
  });

  useEffect(() => {
    if (confirmed) {
      router.push("/login/");
    }
  }, [router, confirmed]);

  return (
    <>
      <Center h="100vh" pb={20}>
        <VStack
          justify={["flex-start", "flex-start", "center"]}
          spacing={50}
          color="main"
          h="100%"
        >
          <VStack w={["100%", "80%", "100%", "100%"]} spacing={8}>
            <VStack w="100%" spacing={4}>
              <Text fontSize="2xl" fontWeight="600" align="center">
                Almost done!
                <br />
                Verify your email address
              </Text>
              <Text fontSize="l" fontWeight="500" align="center">
                We emailed a 6-digit code to email. Enter the code below to
                confirm your email address
              </Text>
            </VStack>
            <form onSubmit={formik.handleSubmit} style={{ width: "90%" }}>
              <VStack w="100%" spacing={12}>
                <HStack>
                  <PinInput
                    otp
                    size="lg"
                    onChange={async (e) =>
                      await formik.setFieldValue("code", e)
                    }
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
                <Button
                  type="submit"
                  colorScheme="purple"
                  width="full"
                  mt="350px"
                >
                  Verify
                </Button>
              </VStack>
            </form>
            <form>
              <Link color="purple.500" href="#" onClick={onOpen}>
                <Text
                  fontSize="m"
                  fontWeight="400"
                  align="center"
                  onClick={() => formikResendCode.handleSubmit()}
                >
                  Did not receive a code? Resend
                </Text>
              </Link>
            </form>
          </VStack>
        </VStack>
      </Center>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody color="main">
              <HStack justify="center" p="10%">
                {codeSent ? (
                  <>
                    <Text fontSize="xl"> Code was sent </Text>
                    <CheckCircleIcon boxSize={6} color="green.500" />
                  </>
                ) : (
                  <>
                    <Text fontSize="xl"> Resending code </Text>
                    <Spinner size="xs" />
                  </>
                )}
              </HStack>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
