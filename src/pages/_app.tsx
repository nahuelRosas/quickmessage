import "@aws-amplify/ui-react/styles.css";

import { AmplifyProvider } from "@aws-amplify/ui-react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Amplify } from "aws-amplify";

import awsconfig from "../../aws-exports";

import type { AppProps } from "next/app";
Amplify.configure({ ...awsconfig, ssr: true });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AmplifyProvider>
      <ChakraProvider>
        <Flex bg="gray.900">
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </AmplifyProvider>
  );
}
