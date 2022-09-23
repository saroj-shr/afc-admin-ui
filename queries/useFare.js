import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateFares = "Fares";

const getAllFares = async (url) => {
  const body = JSON.stringify({
    query: `query {
    fares(where: {}, orderBy: { created_at: desc } ) {
      id
      created_at
      current_fare
      pervious_fare
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

  const { data } = JSON.parse(JSON.stringify(await (await axios(config)).data));
  return data;
};

const useGetAllFare = ({ url }) =>
  useQuery([stateFares], async () => await getAllFares(url));

const updateFare = async ({ current_fare, previous_fare, url }) => {
  const body = JSON.stringify({
    query: `mutation{
      createOneFare(data:{
        current_fare:${current_fare}
        pervious_fare:${previous_fare}
      }){
        id
        current_fare
        pervious_fare
      }}`,
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

export { stateFares, updateFare, getAllFares, useGetAllFare };
