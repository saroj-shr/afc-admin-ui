import React from "react";
import { useSession, getSession } from "next-auth/react";
import { useMutation, QueryClient, dehydrate } from "@tanstack/react-query";
import { Formik, Field, Form } from "formik";
import {
  useGetAllHistory,
  stateHistory,
  getAllHistory,
} from "../../queries/useHistory";
import IsLoadingUI from "../../comps/IsLoading";

export default function History(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: historyRefetch,
  } = useGetAllHistory({ url });

  console.log(history);

  const mutation = useMutation(updateHistory, {
    onSettled: () => historyRefetch(),
  });
  if (isHistoryLoading) <IsLoadingUI />;

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            History Management
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {/* Stat */}
              {/* {statHistory()}

              <div className="divider"></div> */}

              {/* Input  */}
              {/* <h2 className="text-xl font-bold">Update History</h2>
              {updateHistory()} */}

              {/* <div className="divider"></div> */}

              {/* Table */}
              {historyTable()}
            </div>
          </div>
        </div>
      </main>
    </>
  );

  function historyTable() {
    if (isHistoryLoading)
      return (
        <div className="shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );

    if (history)
      return (
        <div className="grid ">
          <div>
            <h2 className="text-xl font-bold">History List</h2>
          </div>

          <div className="px-4 py-6 sm:px-0">
            <div className="">
              <table className="table table-compact w-full table-zebra">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Card UID</th>
                    <th>Create at</th>
                    <th>GPS Coordinate</th>
                    <th>Distance Traveled</th>
                    <th>Current Card Balance</th>
                    <th>Current Fare</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {history.histories.map((h) => (
                    <tr key={h.id}>
                      {/* <th>{i.id}</th> */}
                      <td>{h.id}</td>
                      <td>{h.card.card_serial_id}</td>
                      <td>{new Date(h.create_at).toDateString()}</td>
                      <td>{h.gps_coordinate_start}-{h.gps_coordinate_end}</td>
                      <td>{h.distance_traveled}</td>
                      <td>{h.current_card_balance}</td>
                      <td>{h.current_fare}</td>
                      <td>{h.total_cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
  }

  function updateHistory() {
    if (isHistoryLoading)
      return (
        <div className="shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );
    return (
      <Formik
        initialValues={{
          updateHistory: history.histories[0].current_history,
        }}
        onSubmit={(values) => {
          mutation.mutate({
            current_history: values.updateHistory,
            previous_history: history.histories[0].current_history,
            url: props.backendURL,
          });
        }}
      >
        <Form>
          <div className="flex justify-start mt-4">
            <div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="number"
                  min="0.00"
                  max="1000.00"
                  step="0.1"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="updateHistory"
                  name="updateHistory"
                  placeholder="Enter History"
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

  function statHistory() {
    if (isHistoryError) return <p>Error</p>;
    if (history)
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
            <div className="stat-title">Current History</div>
            <div className="stat-value">Rs . {history.histories[0].current_history}</div>
            <div className="stat-desc">Per Kilometer</div>
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
            <div className="stat-title">Last Updated</div>
            <div className="stat-value">
              {new Date(history.histories[0].created_at).toDateString()}
            </div>
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

  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery([stateHistory], async () =>
  //   JSON.parse(JSON.stringify(await getAllHistory.data))
  // );
  // return {
  //   props: { session, dehydratedState: dehydrate(queryClient) },
  // };

  return {
    props: { session, ...{ backendURL: process.env.BACKEND_URL } },
  };
}
