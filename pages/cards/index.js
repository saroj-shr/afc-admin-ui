import { useSession, getSession } from "next-auth/react";
import { Formik, Field, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import { addCard, useGetAllCards } from "../../queries/useCards";
import IsLoadingUI from "../../comps/IsLoading";
import Link from "next/link";

export default function Cards(props) {
  const { data: session } = useSession();

  if (session === "loading") {
    return <p>Loading</p>;
  }

  const url = props.backendURL;

  const {
    data: cards,
    isLoading: isCardsLoading,
    isError: isCardsError,
    refetch: refetchCards,
  } = useGetAllCards({ url });

  const addCardMutation = useMutation(addCard, {
    onSettled: () => refetchCards(),
  });

  if (isCardsLoading) return <IsLoadingUI />;

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Cards Management
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {/* Stat */}
              {/* {cardStat()} */}

              <div className="divider"></div>
            </div>

            <div className="grid ">
              {/* Input  */}
              <div className="flex w-full">
                <div className="grid flex-grow ">
                  <h2 className="text-xl font-bold">Add New Cards</h2>
                  {addNewCards()}
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Table */}
            <div className="grid ">
              <div>
                <h2 className="text-xl font-bold">Cards List</h2>
              </div>

              {cardTable()}
            </div>
          </div>
        </div>
      </main>
    </>
  );

  function cardTable() {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>Card Id</th>
                <th>Current Balance</th>
                <th>Previous Balance</th>

                <th>Created at</th>
                <th>Updated at</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cards.cards.map((card) => (
                <tr key={card.id}>
                  {/* <th>{card.id}</th> */}
                  <th></th>
                  <td>{card.card_serial_id}</td>
                  <td>Rs. {card.current_balance}</td>
                  <td>Rs. {card.previous_balance}</td>
                  <td>
                    {new Date(card.created_at).toDateString() +
                      " " +
                      new Date(card.created_at).getHours() +
                      ":" +
                      new Date(card.created_at).getMinutes()}
                  </td>

                  <td>
                    {new Date(card.update_at).toDateString() +
                      " " +
                      new Date(card.update_at).getHours() +
                      ":" +
                      new Date(card.update_at).getMinutes()}
                  </td>
                  <td>
                    {card.status === "active" ? (
                      <div className="badge badge-success gap-2">
                        <div className="text-sm opacity-90">
                          {card.status.toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="badge badge-warning gap-2">
                        <div className="text-sm opacity-90">
                          {card.status.toUpperCase()}
                        </div>
                      </div>
                    )}
                  </td>
                  <th>
                    <Link href={`/cards/card/${card.id}`}>
                      <button className="btn btn-ghost btn-xs">Details</button>
                    </Link>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function addNewCards() {
    return (
      <Formik
        initialValues={{
          cardNumber: "",
          openingBalance: 100,
        }}
        onSubmit={async (values) => {
          addCardMutation.mutate({
            url,
            cardID: values.cardNumber,
            cardBalance: values.openingBalance,
          });
        }}
      >
        <Form>
          <div className="flex justify-start mt-4">
            <div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="Enter Number Card"
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="number"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="openingBalance"
                  name="openingBalance"
                  placeholder="Enter Opening Balance"
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm  btn-outline  w-full btn-accent"
              >
                Add
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    );
  }

  function cardStat() {
    return (
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Number of Cards</div>
          <div className="stat-value">31K</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Active</div>
          <div className="stat-value">4,200</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Inactive</div>
          <div className="stat-value">1,200</div>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session, ...{ backendURL: process.env.BACKEND_URL } },
  };
}
