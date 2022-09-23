import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateUsers = "Users";
const stateCountUsers = "CountUsers";

const getAllUsers = async (url) => {
  const body = JSON.stringify({
    query: `query {
    users(where: {}, orderBy: { created_at: desc }) {
      id
      firstName
      lastName
      email
      userType
      phoneName
      imageURL
      status
      created_at
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

const useGetAllUsers = ({ url }) =>
  useQuery([stateUsers], async () => {
    return await getAllUsers(url);
  });

const getUsersStats = async ({ url }) => {
  // get all count
  const allCount = await axios.post(
    url,
    JSON.stringify({
      query: `query { 
          usersCount(where: { })
        }    `,
      variables: {},
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // get active count
  const activeCount = await axios.post(
    url,
    JSON.stringify({
      query: `query allCount { 
          usersCount(where: { status: { equals: "active" } })
        }`,
      variables: {},
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return {
    allCount: allCount.data.data.usersCount,
    activeCount: activeCount.data.data.usersCount,
    inActiveCount:
      allCount.data.data.usersCount - activeCount.data.data.usersCount,
  };
};
const useGetUsersStats = ({ url }) =>
  useQuery([stateCountUsers], async () => {
    return await getUsersStats(url);
  });

export {
  stateUsers,
  getAllUsers,
  useGetAllUsers,
  getUsersStats,
  useGetUsersStats,
};
