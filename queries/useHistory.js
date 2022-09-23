import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateHistory = "History";

const getAllHistory = async (url) => {
  const body = JSON.stringify({
    query: `query{
      histories(where: {}, orderBy: { create_at: desc }){
        id
        create_at
        gps_coordinate_start
        gps_coordinate_end
        distance_traveled
        card{
          id
          card_serial_id
        }
        current_card_balance
        current_fare
        total_cost
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

const useGetAllHistory = ({ url }) =>
  useQuery([stateHistory], async () => await getAllHistory(url));


export { stateHistory, getAllHistory, useGetAllHistory };
