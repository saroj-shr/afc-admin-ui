import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const stateCard = "cardsDetails";
const stateCardHistory = "card";

const getCardDetails = async ({ url, id }) => {
  const body = JSON.stringify({
    query: `query {
      cards(where: { id: { equals: "${id}" } }) {
        id
        card_serial_id
        current_balance
        previous_balance
        status
        created_at
        update_at
        user_id
        History {
          id
          create_at
          gps_coordinate_start
          gps_coordinate_end
          distance_traveled
          current_card_balance
          current_fare
          total_cost
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

const useGetCardDetails = ({ url, id }) =>
  useQuery([stateCard], async () => {
    return await getCardDetails({ url, id });
  });

const changeCardStatus = async ({ url, id, status }) => {
  const body = JSON.stringify({
    query: `
    mutation {
      updateOneCards(
        where: { id: "${id}" }
        data: { status: {
          set: "${status}"
        } }
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
  ).data.data;
};

const topUpCard = async ({ url, id, incrementBy, currentBalance }) => {
  const body = JSON.stringify({
    query: `
      mutation {
        updateOneCards(
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

const assgineCard = async ({ url, cardId, userId }) => {
  const body = JSON.stringify({
    query: `
      mutation assigneUser {
        updateOneCards(
          where: { id: "${cardId}" }
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

// const cardHistory = async ({ url, id }) => {
//   const body = JSON.stringify({
//     query: `  query {
//       histories(where: {
//         card:{
//           card_serial_id:{
//             equals:"${id}"
//           }
//         }
//       }, orderBy: { create_at: desc }) {
//         id
//         create_at
//         gps_coordinate_start
//         gps_coordinate_end
//         distance_traveled
//         current_card_balance
//         current_fare
//         total_cost
//       }
//     }
//     `,
//     variables: {},
//   });

//   const config = {
//     method: "post",
//     url,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: body,
//   };

//   return await (
//     await axios(config)
//   ).data.data;


// }
// const useCardHistory = ({ url, id }) =>
//   useQuery([stateCard], async () => {
//     return await cardHistory({ url, id });
//   });

export {
  stateCard,
  getCardDetails,
  changeCardStatus,
  useGetCardDetails,
  topUpCard,
  assgineCard
};
