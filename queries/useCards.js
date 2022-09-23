import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateCards = "Cards";

const getAllCards = async (url) => {
  const body = JSON.stringify({
    query: `
    query {
      cards(where: {}, orderBy: { created_at: desc }) {
        id
        card_serial_id
        current_balance
        previous_balance
        status
        user_id
        created_at
        update_at
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

const useGetAllCards = ({ url }) =>
  useQuery([stateCards], async () => await getAllCards(url));

const addCard = async ({ url, cardID, cardBalance }) => {
  const body = JSON.stringify({
    query: `
    mutation{
      createOneCards(data:{
        card_serial_id:"${cardID}", 
        current_balance:${cardBalance},
        previous_balance:0,
      }){
        id
        card_serial_id
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

const assignCardToUser = async ({ url, cardID, userId }) => {
  const body = JSON.stringify({
    query: `
    mutation{
      createOneCards(data:{
        card_serial_id:"${cardID}", 
        current_balance:${cardBalance},
        previous_balance:0,
      }){
        id
        card_serial_id
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

export { stateCards, addCard, getAllCards, useGetAllCards };
