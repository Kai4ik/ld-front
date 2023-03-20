"use client";

// external modules
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = {
    colors: {
      main: "#80485B",
      secondary: "#F9A109",
    },
    styles: {
      global: {
        "html, body": {
          boxSizing: "border-box",
          margin: "0",
          padding: "0",
          bg: "#F7F7F7",
        },
      },
    },
    components: {
      Input: {
        baseStyle: {
          field: {
            _autofill: {
              boxShadow: "0 0 0px 1000px #F7F7F7 inset",
              textFillColor: "#80485B",
            },
          },
        },
      },
    },
  };

  const customTheme = extendTheme(theme);

  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
