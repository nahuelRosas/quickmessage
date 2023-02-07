# WELCOME!

#### This project is called QuickMessage, created to show my CloudNative skills and the use of APIs.

#### As a brief introduction, the project is created with AWS-Amplify, NextJS, Typescript, ChakraUI, GraphQl.

We will start by creating the application using the following command:

```shell
npx create-next-app@latest --typescript
```

We will use the following configuration:

```shell
✔ What is your project named? … quickmessage
✔ Would you like to use ESLint with this project? Yes
✔ Would you like to use `src/` directory with this project?  Yes
✔ Would you like to use experimental `app/` directory with this project? No
✔ What import alias would you like configured? … @/*
```

Next, we will proceed to install the following libraries:

"@aws-amplify/ui-react"
"@chakra-ui/react"
"@emotion/react"
"@emotion/styled"
"aws-amplify"
"framer-motion"
"react-icons"

Using this command:

```shell
yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion react-icons @aws-amplify/ui-react aws-amplify

***Note, use Yarn as Npm may have issues with dependencies.
```

We will proceed to generate the initial configuration for AWS-Amplify:

```shell
amplify init
```

We will follow this configuration:

```shell
? Enter a name for the project quickmessage
The following configuration will be applied:

Project information
| Name: quickmessage
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm run-script build
| Start Command: npm run-script start

? Initialize the project with the above configuration? Yes Using default provider  awscloudformation
? Select the authentication method you want to use: AWS profile

? Please choose the profile you want to use default
Adding backend environment dev to AWS Amplify app: d26vzsxc8b4xbh
```

Once this process is complete, we will add the API we'll use, in this case GraphQL:

```shell
> amplify add api
? Select from one of the below mentioned services: GraphQL
? Here is the GraphQL API that we will create. Select a setting to edit or continue Authorization modes: Amazon Cognito User Pool
Using service: Cognito, provided by: awscloudformation

 The current configured provider is Amazon Cognito.

 Do you want to use the default authentication and security configuration? Default configuration
 How do you want users to be able to sign in? Username
 Do you want to configure advanced settings? No, I am done.

? Configure additional auth types? No
? Here is the GraphQL API that we will create. Select a setting to edit or continue Conflict detection (required for DataStore): Disabled
? Enable conflict detection? Yes
? Select the default resolution strategy Auto Merge
? Here is the GraphQL API that we will create. Select a setting to edit or continue Continue
? Choose a schema template: Blank Schema
✅ GraphQL schema compiled successfully.
```

Once the process is completed, we must implement the schema to be used in Graphql, so we will go to the following route:

```
amplify/ backend/ api/ quickmessage/ schema.graphql

```

And we will implement the following schema:

```sql
type Message @model @auth(rules: [{ allow: private }]) {
  id: ID!
  owner: String!
  message: String!
}

```

And we will proceed to push to AWS:

```shell
amplify push


┌──────┬─────────────┬───────┬───────────┐
│ Category │ Resource name        │ Operation │ Provider plugin   │
├──────┼─────────────┼───────┼───────────┤
│ Auth     │ quickmessagedd61764a │ Create    │ awscloudformation │
├─────┼───────────────┼───────┼─────────────┤
│ Api      │ quickmessage         │ Create    │ awscloudformation │
└─────┴────────────┴───────┴────────────┘
? Are you sure you want to continue? Yes
 Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target typescript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.ts
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
? Enter the file name for the generated code src/API.ts
```

Once this process is completed, we can begin designing our application, so we will proceed to modify the \_app.tsx file.

```javascript
import "@aws-amplify/ui-react/styles.css";

import { AmplifyProvider } from "@aws-amplify/ui-react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Amplify } from "aws-amplify";

import awsconfig from "../aws-exports";

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
```

Once the process is completed, we can start to layout our application, so we will proceed to modify the \_app.tsx file.

Note that in our \_app file is where the Amplify setup begins, and it is indicated that it should be used with SSR for a successful deployment on AWS hosting.

The next file to be modified will be /index.tsx.

```javascript
import { withAuthenticator } from "@aws-amplify/ui-react";
import {
  Box,
  Container,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FaRegArrowAltCircleRight, FaRegTimesCircle } from "react-icons/fa";

import useRecoveryData from "../hooks/useRecoveryData";

const Home = () => {
  const {
    handleSubmit,
    getUserName,
    RootState,
    isMe,
    getMessagesState,
    stateMessages,
  } = useRecoveryData();
  RootState();
  const user = getUserName();

  const [messageText, setMessageText] = useState("");
  const { loadingSendMessage, sendMessage } = handleSubmit;

  const goToDown = () => {
    const chat = document.getElementById("chat");
    chat?.scrollTo(0, chat.scrollHeight);
  };

  useEffect(() => {
    goToDown();
  }, [getMessagesState]);

  return (
    <>
      <Head>
        <title>QuickMessage</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        maxW="container.xl"
        h="100vh"
        maxH={"100vh"}
        overflowY="hidden"
        display="flex"
        alignItems="center"
        bg="gray.700"
        justifyContent="center">
        <Flex direction="column" w="100%" gap={4} bg="gray.900">
          <Heading
            as="h1"
            fontSize="6xl"
            color="white"
            alignSelf={"center"}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="shorter">
            QuickMessage
          </Heading>

          <Flex
            direction="column"
            w="100%"
            h="100%"
            p={8}
            mt={4}
            borderRadius="md"
            boxShadow="md">
            <Flex
              flexDirection={"column"}
              id="chat"
              maxHeight={"60vh"}
              overflowY="scroll">
              {stateMessages?.map(
                (message: { id: any, owner: string, message: any }) => {
                  return (
                    <Box
                      m={4}
                      key={message.id}
                      py={4}
                      px={8}
                      bg={isMe(message.owner) ? "teal.100" : "gray.300"}
                      borderRadius="md"
                      alignSelf={
                        isMe(message.owner) ? "flex-end" : "flex-start"
                      }>
                      <Heading
                        as="h3"
                        fontSize="md"
                        color="gray.700"
                        fontWeight="extrabold"
                        letterSpacing="tight"
                        lineHeight="shorter">
                        {message.message}
                      </Heading>
                      <Heading
                        as="h4"
                        fontSize="md"
                        color="gray.500"
                        fontWeight="extrabold"
                        letterSpacing="tight"
                        lineHeight="shorter">
                        {message.owner}
                      </Heading>
                    </Box>
                  );
                }
              )}
            </Flex>
            <FormControl
              flex="1"
              overflowY="auto"
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              flexDirection={"row"}
              mt={4}
              gap={4}
              w="100%">
              <Input
                type="text"
                placeholder="Enter your message"
                value={messageText}
                onChange={(e: { target: { value: any } }) =>
                  setMessageText(e.target.value)
                }
                size="lg"
                fontWeight="normal"
                letterSpacing="wide"
                alignSelf={"center"}
                fontSize="lg"
                lineHeight="shorter"
                px={8}
                h={14}
                color="white"
                borderRadius="md"
                boxShadow="md"
              />
              <IconButton
                disabled={messageText.length === 0}
                icon={
                  messageText.length > 0 ? (
                    <FaRegArrowAltCircleRight />
                  ) : (
                    <FaRegTimesCircle />
                  )
                }
                color={messageText.length > 0 ? "teal.500" : "red.500"}
                type="submit"
                bg={messageText.length > 0 ? "teal.100" : "red.100"}
                aria-label="Send message"
                fontWeight="extrabold"
                letterSpacing="wide"
                alignSelf={"center"}
                fontSize="4xl"
                lineHeight="shorter"
                px={8}
                h={14}
                _hover={{
                  bg: messageText.length > 0 ? "teal.200" : "red.200",
                }}
                _active={{
                  bg: messageText.length > 0 ? "teal.300" : "red.300",
                }}
                borderRadius="md"
                boxShadow="md"
                onClick={() => {
                  messageText.length > 0 &&
                    sendMessage({
                      owner: user,
                      messageText,
                    });
                  setMessageText("");
                }}
                isLoading={loadingSendMessage}></IconButton>
            </FormControl>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default withAuthenticator(Home);
```

It is important to note that a file called useRecoveryData was called. It is a custom Hook which will allow us to make relevant calls to our back end, and we will analyze it in parts, as this is where the logic process takes place.

##### UseRecoveryData

```javascript
import * as subscriptions from "@/graphql/subscriptions";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { useToast } from "@chakra-ui/react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { Observable } from "zen-observable-ts";

import { createMessage } from "../graphql/mutations";
import { listMessages } from "../graphql/queries";
```

When importing, we call types such as GraphQLResult and Observable, both of which will be used to compare data types in another part of the application. We will make use of React hooks and also AWS-generated queries such as CreateMessage and ListMessage, which will be used in specific functions.

```javascript
const useRecoveryData = () => {
  const toast = useToast();
  const [userState, setUserState] = useState<{
    user: CognitoUser | undefined;
    state: boolean;
  }>({
    user: undefined,
    state: false,
  });
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const [stateMessages, setStateMessages] = useState<any[]>([]);

```

We then generate the local states that will be used; the names explain their own meaning.

```javascript
const orderByDate = async ({
  messages,
}: {
  messages: {
    createdAt: string,
    id: string,
    message: string,
    owner: string,
  }[],
}) => {
  return messages.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA.getTime() - dateB.getTime();
  });
};
```

Our first function is "orderByData", where we receive an array and using the "sort" function, we will organize it based on the date.

```javascript
const getMessages = async () => {
  try {
    const messages: GraphQLResult<any> = await API.graphql({
      query: listMessages,
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    const _messages: any[] = await orderByDate({
      messages: messages.data.listMessages.items,
    });
    return _messages;
  } catch (error) {
    toast({
      title: "Error",
      description: "Error to get messages",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  }
};
```

The getMessages function is asynchronous, where we make a call to the API, passing in the query generated by Amplify, and also specifying that we must use Amazon Cognito for authentication. Our error catch will throw a Chakra toast in case of an error.

```javascript
const getCurrentAuthenticatedUser = async () => {
  if (userState && userState.state) {
    return;
  }
  try {
    const user = await Auth.currentAuthenticatedUser();
    setUserState({ user, state: true });
  } catch (error) {
    toast({
      title: "Error",
      description: "Error to get user",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    setUserState({ user: undefined, state: true });
  }
};
```

The getCurrentAuthenticatedUser function will retrieve the state generated by Amplify. Then, we will store this state in a local state.

```javascript
const sendMessage = async ({
  owner,
  messageText,
}: {
  owner: string | undefined,
  messageText: string,
}) => {
  try {
    if (!owner) {
      throw new Error("Owner is required");
    }
    setLoadingSendMessage(true);
    const message = {
      owner: owner,
      message: messageText,
    };
    await API.graphql({
      query: createMessage,
      variables: { input: message },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Error to send message",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  } finally {
    setLoadingSendMessage(false);
  }
};
```

The SendMessage function makes use of the same tools as other functions, with the only difference being the change in the LoadingSendMessage state. This allows the button on the user interface to display a spinner while the message is being sent.

```javascript
 const subscribeToNewMessages = async () => {
    const subscription = await API.graphql(
      graphqlOperation(subscriptions.onCreateMessage)
    );
    if (subscription instanceof Observable) {
      const response = subscription.subscribe({
        next: (res: any) => {
          getMessages().then((messages) => {
            setStateMessages(messages as any[]);
          });
        },
        error: (error: any) => {
          console.warn(error);
        },
      });
      return () => {
        if (!response.closed) {
          response.unsubscribe();
        }
      };
    }
  };
```

The "subscribeToNewMessage" that is automatically called in the "RootState." The function will make a call to the API, and if the response is an instance of the "Observable" type, it will proceed to retrieve the messages again. After the message retrieval process is complete, it will unsubscribe from the subscription.

```javascript
useEffect(() => {
    getMessages().then((messages) => {
      setStateMessages(messages as any[]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

We will also make use of the useEffect hook to retrieve the messages once the application is started, which will be the first call.
  
  