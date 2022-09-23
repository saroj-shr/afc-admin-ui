import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateVehicles = "Vehicles";

const getAllVehicles = async (url) => {
  const body = JSON.stringify({
    query: `
      query{
        vehicles(where:{}, orderBy:{
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

  const { data } = JSON.parse(JSON.stringify(await (await axios(config)).data));
  return data;
};

const useGetAllVehicles = ({ url }) =>
  useQuery([stateVehicles], async () => await getAllVehicles(url));

const addVehicle = async ({
  url,
  name,
  description,
  license_plate,
  passenger_capacity,
}) => {
  const body = JSON.stringify({
    query: `
      mutation{
        createOneVehicles(data:{
          name:"${name}",
          description: "${description}"
          license_plate:"${license_plate}",
          passenger_capacity:${passenger_capacity},
        }){
          id
          license_plate
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

const assignvehicleToUser = async ({ url, vehicleID, userId }) => {
  const body = JSON.stringify({
    query: `
    mutation{
      createOneVehicles(data:{
        vehicle_serial_id:"${vehicleID}", 
        current_balance:${vehicleBalance},
        previous_balance:0,
      }){
        id
        vehicle_serial_id
        current_balance
        previous_balance
        status
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

const assignvehicleToVehicles = async ({ url, vehicleID, userId }) => {
  const body = JSON.stringify({
    query: `
    mutation{
      createOneVehicles(data:{
        vehicle_serial_id:"${vehicleID}", 
        current_balance:${vehicleBalance},
        previous_balance:0,
      }){
        id
        vehicle_serial_id
        current_balance
        previous_balance
        status
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

export { stateVehicles, addVehicle, getAllVehicles, useGetAllVehicles };
