import * as subscriptions from "@/graphql/subscriptions";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { useToast } from "@chakra-ui/react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { Observable } from "zen-observable-ts";

import { createMessage } from "../graphql/mutations";
import { listMessages } from "../graphql/queries";

const useRecoveryData = () => {
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
  const orderByDate = async ({
    messages,
  }: {
    messages: {
      createdAt: string;
      id: string;
      message: string;
      owner: string;
    }[];
  }) => {
    return messages.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  };

  useEffect(() => {
    getMessages().then((messages) => {
      setStateMessages(messages as any[]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const sendMessage = async ({
    owner,
    messageText,
  }: {
    owner: string | undefined;
    messageText: string;
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

  const getUserName = () => {
    return userState?.user?.getUsername();
  };

  const isMe = (owner: string) => {
    return owner === getUserName();
  };

  const RootState = () => {
    getCurrentAuthenticatedUser();
    subscribeToNewMessages();
  };

  const subscribeToNewMessages = useCallback(async () => {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessagesState = () => {
    return stateMessages;
  };

  return {
    getMessages,
    RootState,
    getCurrentAuthenticatedUser,
    AuthState: userState?.user,
    getUserName,
    stateMessages,
    getMessagesState,
    isMe,
    handleSubmit: {
      sendMessage,
      loadingSendMessage,
    },
  };
};

export default useRecoveryData;
