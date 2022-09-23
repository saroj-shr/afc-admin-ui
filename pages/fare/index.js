import React from "react";
import { useSession, getSession } from "next-auth/react";
import { useMutation, QueryClient, dehydrate } from "@tanstack/react-query";
import { Formik, Field, Form } from "formik";
import {
  updateFare,
  useGetAllFare,
  stateFares,
  getAllFares,
} from "../../queries/useFare";
import IsLoadingUI from "../../comps/IsLoading";

export default function Fare(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;

  const {
    data: fare,
    isLoading: isFareLoading,
    isError: isFareError,
    refetch: fareRefetch,
  } = useGetAllFare({ url });

  const mutation = useMutation(updateFare, {
    onSettled: () => fareRefetch(),
  });
  if (isFareLoading) <IsLoadingUI />;

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Fare Management
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {/* Stat */}
              {statFare()}

              <div className="divider"></div>

              {/* Input  */}
              <h2 className="text-xl font-bold">Update Fare</h2>
              {updateFares()}

              <div className="divider"></div>

              {/* Table */}
              {fareTable()}
            </div>
          </div>
          {mutation.isSuccess ? (
            <div className="toast toast-end">
              <div className="alert alert-success">
                <div>
                  <span>Fare Updated.</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );

  function fareTable() {
    if (isFareLoading)
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

    if (isFareError) <p>Error</p>;

    if (fare)
      return (
        <div className="grid ">
          <div>
            <h2 className="text-xl font-bold">Fare History</h2>
          </div>

          <div className="px-4 py-6 sm:px-0">
            <div className="">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Updated Fare</th>
                    <th>Pervious Fare</th>
                    <th>Update At </th>
                  </tr>
                </thead>
                <tbody>
                  {fare.fares.map((i) => (
                    <tr key={i.id}>
                      {/* <th>{i.id}</th> */}
                      <th></th>
                      <td>{i.current_fare}</td>
                      <td>{i.pervious_fare}</td>
                      <td>{new Date(i.created_at).toString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
  }

  function updateFares() {
    if (isFareLoading)
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
          updateFare: fare.fares[0].current_fare,
        }}
        onSubmit={(values) => {
          mutation.mutate({
            current_fare: values.updateFare,
            previous_fare: fare.fares[0].current_fare,
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
                  id="updateFare"
                  name="updateFare"
                  placeholder="Enter Fare"
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

  function statFare() {
    if (isFareError) return <p>Error</p>;
    if (fare)
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
            <div className="stat-title">Current Fare</div>
            <div className="stat-value">Rs . {fare.fares[0].current_fare}</div>
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
              {new Date(fare.fares[0].created_at).toDateString()}
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
  // await queryClient.prefetchQuery([stateFares], async () =>
  //   JSON.parse(JSON.stringify(await getAllFares.data))
  // );
  // return {
  //   props: { session, dehydratedState: dehydrate(queryClient) },
  // };

  return {
    props: { session, ...{ backendURL: process.env.BACKEND_URL } },
  };
}
