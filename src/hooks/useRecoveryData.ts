import { GraphQLResult } from "@aws-amplify/api-graphql";
import { useToast } from "@chakra-ui/react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { API, Auth } from "aws-amplify";
import { useCallback, useState } from "react";

import { createMessage } from "../graphql/mutations";
import { listMessages } from "../graphql/queries";

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

  const orderByDate = ({
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

  const getMessages = async () => {
    try {
      const messages: GraphQLResult<any> = await API.graphql({
        query: listMessages,
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      const _messages: any[] = orderByDate({
        messages: messages.data.listMessages.items,
      });

      return _messages;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while fetching messages",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

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
        description: "Error while fetching user",
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
      const _error = error as Error;
      toast({
        title: "Error",
        description: _error.message,
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

  const isMe = ({ owner }: { owner: string }) => {
    return owner === getUserName();
  };

  const RootState = () => {
    getCurrentAuthenticatedUser();
  };
  return {
    getMessages,
    RootState,
    getCurrentAuthenticatedUser,
    AuthState: userState?.user,
    getUserName,
    isMe,
    handleSubmit: {
      sendMessage,
      loadingSendMessage,
    },
  };
};

export default useRecoveryData;
