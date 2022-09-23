import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateVehicle = "UsersDetails";

const getVehicleDetails = async ({ url, id }) => {
  const body = JSON.stringify({
    query: `
      query{
        vehicles(where:{
          id:{
            equals:"${id}"
          }
        }, orderBy:{
          created_at: desc
        }){
          id
          name
          status
          license_plate
          passenger_capacity
          route_id
          created_at
          Pos{
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

const useGetVehicleDetails = ({ url, id }) =>
  useQuery([stateVehicle], async () => {
    return await getVehicleDetails({ url, id });
  });

const changeVehicleStatus = async ({ url, id, status }) => {
  const body = JSON.stringify({
    query: `
    mutation {
      updateOneVehicles(
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

const topUpVehicle = async ({ url, id, incrementBy, currentBalance }) => {
  const body = JSON.stringify({
    query: `
      mutation {
        updateOneVehicles(
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

const assgineVehicle = async ({ url, VehicleId, routeId }) => {
  console.log(VehicleId, routeId);
  const body = JSON.stringify({
    query: `
      mutation assigneUser {
        updateOneVehicles(
          where: { id: "${VehicleId}" }
          data: {       routes:{
            connect:{
              id:"${routeId}"
            }
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
  ).data;
};
export {
  stateVehicle,
  getVehicleDetails,
  changeVehicleStatus,
  useGetVehicleDetails,
  topUpVehicle,
  assgineVehicle,
};
