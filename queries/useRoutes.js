import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateRoutes = "Routes";

const getAllRoutes = async (url) => {
  const body = JSON.stringify({
    query: `
    query{
      routes(where:{}, orderBy:{
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

  const { data } = JSON.parse(JSON.stringify(await (await axios(config)).data));
  return data;
};

const useGetAllRoutes = ({ url }) =>
  useQuery([stateRoutes], async () => await getAllRoutes(url));

const addRoute = async ({
  url,
  name,
  description,
  location_name_start,
  locationNameEnd,
  locationGPSStart,
  locationGPSEnd,
  totalDistance,
}) => {
  const body = JSON.stringify({
    query: `
    mutation {
      createOneRoutes(
        data: {
          name:"${name}",
          description:"${description}",
          location_name_start:"${location_name_start}",
          location_name_end:"${locationNameEnd}",
          location_gps_start:"${locationGPSStart}",
          location_gps_end:"${locationGPSEnd}",
          total_distance:${totalDistance},
        }
      ) {
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
        Vehicles {
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
  ).data;
};

const assignRouteToUser = async ({ url, routeID, userId }) => {
  const body = JSON.stringify({
    query: `
    mutation{
      createOneRoutes(data:{
        route_serial_id:"${routeID}", 
        current_balance:${routeBalance},
        previous_balance:0,
      }){
        id
        route_serial_id
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

export { stateRoutes, addRoute, getAllRoutes, useGetAllRoutes };
