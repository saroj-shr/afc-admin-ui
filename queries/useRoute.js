import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateRoute = "UsersDetails";

const getRouteDetails = async ({ url, id }) => {
  const body = JSON.stringify({
    query: `
      query{
        routes(where:{
          id:{
            equals:"${id}"
          }
        }, orderBy:{
          created_at: desc
        }){
          id
          name
          description
          location_name_start
          location_name_end
          location_gps_start
          location_gps_end
          total_distance
          created_at
          update_at
          status
          Vehicles{
            id
          }
        }
      }
    `,
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

const useGetRouteDetails = ({ url, id }) =>
  useQuery([stateRoute], async () => {
    return await getRouteDetails({ url, id });
  });

const changeRouteStatus = async ({ url, id, status }) => {
  const body = JSON.stringify({
    query: `
    mutation {
      updateOneRoutes(
        where: { id: "${id}" }
        data: { status: {
          set: "${status}"
        } }
      ) {
        id
      }
    }
    `,
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

const topUpRoute = async ({ url, id, incrementBy, currentBalance }) => {
  const body = JSON.stringify({
    query: `
      mutation {
        updateOneRoutes(
          where: { id: "${id}" }
          data: { current_balance: { increment: ${incrementBy} }, previous_balance: { set: ${currentBalance} } }
          ) {
          id
          current_balance
          previous_balance
        }
      }
    `,
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
  ).data;
};

const assgineRoute = async ({ url, routeId, userId }) => {
  const body = JSON.stringify({
    query: `
      mutation assigneUser {
        updateOneRoutes(
          where: { id: "${routeId}" }
          data: { user: { connect: { id: "${userId}" } } }
        ) {
          id
          user_id
          user{
            id
            firstName
            lastName
          }
        }
      }
    `,
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
  ).data;
};
export {
  stateRoute,
  getRouteDetails,
  changeRouteStatus,
  useGetRouteDetails,
  topUpRoute,
  assgineRoute,
};
