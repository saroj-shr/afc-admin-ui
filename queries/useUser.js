import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateUser = "UsersDetails";

const getUserDetails = async ({ url, id }) => {
  const body = JSON.stringify({
    query: `query {
      users(where: {
        id:{
          equals:"${id}"
        }
      }, orderBy: { created_at: desc }) {
        id
        firstName
        lastName
        email
        phoneName
        imageURL
        status
        userType
        created_at
        Cards{
          id
          created_at
          card_serial_id
          current_balance
          previous_balance
          status
        }
      }
    }`,
    variables: {},
  });

  const config = {
    method: "post",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  return await (
    await axios(config)
  ).data.data;
};

const useGetUserDetails = ({ url, id }) =>
  useQuery([stateUser], async () => {
    return await getUserDetails({ url, id });
  });

const changeUserStatus = async ({ url, id, status }) => {
  const body = JSON.stringify({
    query: `mutation {
      updateOneUsers(
        where: { id: "${id}" }
        data: { status: { set: "${status}" } }
      ) {
        id
        status
      }
    }`,
    variables: {},
  });

  const config = {
    method: "post",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  return await (
    await axios(config)
  ).data.data;
};

export { stateUser, changeUserStatus, getUserDetails, useGetUserDetails };
