import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Field, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import IsLoadingUI from "../../../comps/IsLoading";
import {
  changeRouteStatus,
  getRouteDetails,
  topUpRoute,
  useGetRouteDetails,
  assgineRoute,
} from "../../../queries/useRoute";

export default function RouteDetails(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;
  const id = useRouter().query.id;

  const {
    data: routeDetails,
    isLoading: isLoadingRouteDetails,
    isError: isErrorRouteDetails,
    refetch: routeRefetch,
  } = useGetRouteDetails({ url, id });

  const routeStatusMutation = useMutation(changeRouteStatus, {
    onSettled: () => routeRefetch(),
  });

  const handleUpdateStatus = (e) => {
    routeStatusMutation.mutate({
      id,
      url,
      status: e.target.value,
    });
  };

  const routeTopUpMutation = useMutation(topUpRoute, {
    onSettled: () => routeRefetch(),
  });

  const routeAssigneMutation = useMutation(assgineRoute, {
    onSettled: () => routeRefetch(),
  });
  if (isLoadingRouteDetails) return <IsLoadingUI />;

  function topup() {
    return (
      <Formik
        initialValues={{
          topUpAmmount: 0,
        }}
        onSubmit={async (values) => {
          routeTopUpMutation.mutate({
            url,
            id: routeDetails.routes[0].id,
            incrementBy: values.topUpAmmount,
            currentBalance: routeDetails.routes[0].current_balance,
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
                  step="10"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="topUpAmmount"
                  name="topUpAmmount"
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm  btn-outline  w-full btn-accent"
              >
                Top Up
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    );
  }
  function assgineRouteForm() {
    return (
      <Formik
        initialValues={{
          userId: "",
        }}
        onSubmit={async (values) => {
          routeAssigneMutation.mutate({
            url,
            routeId: routeDetails.routes[0].id,
            vehicleId: values.vehicleId,
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
                  id="vehicleId"
                  name="vehicleId"
                  placeholder="Enter Vehicle Id"
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm  btn-outline  w-full btn-accent"
              >
                Assigne
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    );
  }

  function updateRouteForm() {
    return (
      <Formik
        initialValues={{
          routeNameUpdate: routeDetails.routes[0].name,
          descriptionUpdate: routeDetails.routes[0].description,
          locationNameStart: routeDetails.routes[0].location_name_start,
          locationNameEnd: routeDetails.location_name_end,
          locationGPSStart: routeDetails.location_gps_start,
          locationGPSEnd: routeDetails.location_gps_end,
          totalDistance: routeDetails.total_distance,
        }}
        onSubmit={async (values) => {
          console.log(values);
          addRouteMutation.mutate({
            url,
            name: values.routeNameUpdate,
            description: values.descriptionUpdate,
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
                  id="routeNameUpdate"
                  name="routeName"
                  placeholder="Route Name"
                  value={routeDetails.routes[0].name}
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
                  value={routeDetails.routes[0].description}
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
                  value={routeDetails.routes[0].location_name_start}
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
                  value={routeDetails.routes[0].location_name_end}
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
                  value={routeDetails.routes[0].location_gps_start}
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
                  value={routeDetails.routes[0].location_gps_end}
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="number"
                  required
                  step="0.1"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="totalDistance"
                  name="totalDistance"
                  placeholder="Enter Total Distance in KM"
                  value={routeDetails.routes[0].total_distance}
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm  btn-outline  w-full btn-accent"
              >
                Update
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    );
  }

  function routeDetailsRoute() {
    return (
      <div className="card lg:route-side bg-base-100">
        <figure>
          <Image
            src={"/route.png"}
            alt="card"
            width="256"
            height="256"
            className="object-cover "
          />
        </figure>
        <div className="card-body">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Route Name</div>
              <div className="stat-value">{routeDetails.routes[0].name}</div>
              <div className="stat-desc">
                {new Date(routeDetails.routes[0].created_at).toDateString()}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Details</div>
              <div className="">
                <table className="table w-full">
                  <tbody>
                    <tr>
                      <td>Route Status</td>
                      <td>
                        {routeDetails.routes[0].status == "active" ? (
                          <div className="badge badge-success gap-2">
                            <div className="text-sm opacity-90">
                              {routeDetails.routes[0].status.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="badge badge-warning gap-2">
                            <div className="text-sm opacity-90">
                              {routeDetails.routes[0].status.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Routes id</td>
                      <td>{routeDetails.routes[0].id}</td>
                    </tr>
                    <tr>
                      <td>Routes Description</td>
                      <td>{routeDetails.routes[0].description}</td>
                    </tr>
                    <tr>
                      <td>Location Name Start</td>
                      <td>{routeDetails.routes[0].location_name_start}</td>
                    </tr>
                    <tr>
                      <td>Location Name End</td>
                      <td>{routeDetails.routes[0].location_name_end}</td>
                    </tr>
                    <tr>
                      <td>Location Gps Start</td>
                      <td>{routeDetails.routes[0].location_gps_start}</td>
                    </tr>
                    <tr>
                      <td>Location Gps End</td>
                      <td>{routeDetails.routes[0].location_gps_end}</td>
                    </tr>
                    <tr>
                      <td>Routes Total Distance</td>
                      <td>{routeDetails.routes[0].total_distance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end">
            {routeDetails.routes[0].status == "active" ? (
              <button
                className="btn btn-warning"
                value={"inactive"}
                onClick={(e) => handleUpdateStatus(e)}
              >
                Inactive
              </button>
            ) : (
              <button
                className="btn btn-info"
                value={"active"}
                onClick={(e) => handleUpdateStatus(e)}
              >
                Active
              </button>
            )}

            {/* <label htmlFor="my-modal-5" className="btn modal-button">
              Top Up
            </label>
            {topUpModel()} */}

            <label htmlFor="my-modal-5" className="btn modal-button">
              Assgine Route
            </label>

            {assigneRoute()}

            {/* <label htmlFor="my-modal-4" className="btn modal-button">
              Update Route
            </label>

            {updateRoute()} */}
          </div>
        </div>
      </div>
    );
  }

  function topUpModel() {
    return (
      <>
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">TopUp</h3>
            <div className="py-4">{topup()}</div>
            <div className="modal-action">
              <label htmlFor="my-modal-5" className="btn">
                Close
              </label>
            </div>
          </div>
        </div>
      </>
    );
  }

  function assigneRoute() {
    return (
      <>
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assigne Vehicle</h3>
            <div className="py-4">{assgineRouteForm()}</div>
            <div className="modal-action">
              <label htmlFor="my-modal-5" className="btn">
                Close
              </label>
            </div>
          </div>
        </div>
      </>
    );
  }

  function updateRoute() {
    return (
      <>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assigne Vehicle</h3>
            <div className="py-4">{updateRouteForm()}</div>
            <div className="modal-action">
              <label htmlFor="my-modal-4" className="btn">
                Close
              </label>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Routes Management - Route Details
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {routeDetailsRoute()}

              <div className="divider" />
              {/* {userRouteDetails()} */}

              {/* <div className="divider" /> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
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
