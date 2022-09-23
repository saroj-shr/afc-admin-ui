import { useSession, getSession } from "next-auth/react";
import { Formik, Field, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import { addRoute, useGetAllRoutes } from "../../queries/useRoutes";
import IsLoadingUI from "../../comps/IsLoading";
import Link from "next/link";

export default function Routes(props) {
  const { data: session } = useSession();

  if (session === "loading") {
    return <p>Loading</p>;
  }

  const url = props.backendURL;

  const {
    data: routes,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
    refetch: refetchRoutes,
  } = useGetAllRoutes({ url });

  const addRouteMutation = useMutation(addRoute, {
    onSettled: () => refetchRoutes(),
  });

  if (isRoutesLoading) return <IsLoadingUI />;
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Routes Management
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {/* Stat */}
              {/* {routeStat()} */}

              <div className="divider"></div>
            </div>

            <div className="grid ">
              {/* Input  */}
              <div className="flex w-full">
                <div className="grid flex-grow ">
                  <h2 className="text-xl font-bold">Add New Routes</h2>
                  {addNewRoutes()}
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Table */}
            <div className="grid ">
              <div>
                <h2 className="text-xl font-bold">Routes List</h2>
              </div>

              {routeTable()}
            </div>
          </div>
        </div>
      </main>
    </>
  );

  function routeTable() {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>name</th>
                <th>description</th>
                <th>Location Name Start</th>
                <th>Location Name End</th>
                <th>Location Gps Start</th>
                <th>Location Gps End</th>
                <th>Total Distance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {routes.routes.map((route) => (
                <tr key={route.id}>
                  {/* <th>{route.id}</th> */}
                  <th></th>
                  <td>{route.name}</td>
                  <td>{route.description}</td>
                  <td>{route.location_name_start}</td>
                  <td>{route.location_name_end}</td>
                  <td>{route.location_gps_start}</td>
                  <td>{route.location_gps_end}</td>
                  <td>{route.total_distance}</td>
                  <th>
                    <Link href={`/routes/route/${route.id}`}>
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

  function addNewRoutes() {
    return (
      <Formik
        initialValues={{
          routeName: "",
          description: "",
          locationNameStart: "",
          locationNameEnd: "",
          locationGPSStart: "",
          locationGPSEnd: "",
          totalDistance: 0,
        }}
        onSubmit={async (values) => {
          console.log(values);
          addRouteMutation.mutate({
            url,
            name: values.routeName,
            description: values.description,
            location_name_start: values.locationNameStart,
            location_name_end: values.locationNameEnd,
            location_gps_start: values.locationGPSStart,
            location_gps_end: values.locationGPSEnd,
            totalDistance: values.totalDistance,
          });
        }}
      >
        <Form>
          <div className="flex justify-start mt-4">
            <div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="routeName"
                  name="routeName"
                  placeholder="Route Name"
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="description"
                  name="description"
                  placeholder="Route description"
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="locationNameStart"
                  name="locationNameStart"
                  placeholder="Enter Location Name Start"
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="locationNameEnd"
                  name="locationNameEnd"
                  placeholder="Enter Location Name End"
                />
              </div>

              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="locationGPSStart"
                  name="locationGPSStart"
                  placeholder="Enter GPS Location Start"
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="locationGPSEnd"
                  name="locationGPSEnd"
                  placeholder="Enter GPD Location End"
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="number"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="totalDistance"
                  name="totalDistance"
                  placeholder="Enter Total Distance in KM"
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

  function routeStat() {
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
          <div className="stat-title">Number of Routes</div>
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
