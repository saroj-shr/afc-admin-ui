import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Field, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import IsLoadingUI from "../../../comps/IsLoading";
import {
  changeVehicleStatus,
  getVehicleDetails,
  topUpVehicle,
  useGetVehicleDetails,
  assgineVehicle,
} from "../../../queries/useVehicle";

export default function VehicleDetails(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;
  const id = useRouter().query.id;

  const {
    data: vehicleDetails,
    isLoading: isLoadingVehicleDetails,
    isError: isErrorVehicleDetails,
    refetch: vehicleRefetch,
  } = useGetVehicleDetails({ url, id });

  const vehicleStatusMutation = useMutation(changeVehicleStatus, {
    onSettled: () => vehicleRefetch(),
  });

  const handleUpdateStatus = (e) => {
    vehicleStatusMutation.mutate({
      id,
      url,
      status: e.target.value,
    });
  };

  const vehicleTopUpMutation = useMutation(topUpVehicle, {
    onSettled: () => vehicleRefetch(),
  });

  const vehicleAssigneMutation = useMutation(assgineVehicle, {
    onSettled: () => vehicleRefetch(),
  });
  if (isLoadingVehicleDetails) return <IsLoadingUI />;
  console.log(vehicleDetails)
  function topup() {
    return (
      <Formik
        initialValues={{
          topUpAmmount: 0,
        }}
        onSubmit={async (values) => {
          vehicleTopUpMutation.mutate({
            url,
            id: vehicleDetails.vehicles[0].id,
            incrementBy: values.topUpAmmount,
            currentBalance: vehicleDetails.vehicles[0].current_balance,
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
  function assgineVehicleForm() {
    return (
      <Formik
        initialValues={{
          routeId: "",
        }}
        onSubmit={async (values) => {
          vehicleAssigneMutation.mutate({
            url,
            VehicleId: vehicleDetails.vehicles[0].id,
            routeId: values.routeId,

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
                  id="routeId"
                  name="routeId"
                  placeholder="Enter Route Id"
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

  function updateVehicleForm() {
    return (
      <Formik
        initialValues={{
          vehicleNameUpdate: vehicleDetails.vehicles[0].name,
          descriptionUpdate: vehicleDetails.vehicles[0].description,
          locationNameStart: vehicleDetails.vehicles[0].location_name_start,
          locationNameEnd: vehicleDetails.location_name_end,
          locationGPSStart: vehicleDetails.location_gps_start,
          locationGPSEnd: vehicleDetails.location_gps_end,
          totalDistance: vehicleDetails.total_distance,
        }}
        onSubmit={async (values) => {
          console.log(values);
          addVehicleMutation.mutate({
            url,
            name: values.vehicleNameUpdate,
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
                  id="vehicleNameUpdate"
                  name="vehicleName"
                  placeholder="Vehicle Name"
                  value={vehicleDetails.vehicles[0].name}
                />
              </div>
              <div className="form-floating mb-3 xl:w-96">
                <Field
                  type="text"
                  required
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="description"
                  name="description"
                  placeholder="Vehicle description"
                  value={vehicleDetails.vehicles[0].description}
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
                  value={vehicleDetails.vehicles[0].location_name_start}
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
                  value={vehicleDetails.vehicles[0].location_name_end}
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
                  value={vehicleDetails.vehicles[0].location_gps_start}
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
                  value={vehicleDetails.vehicles[0].location_gps_end}
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
                  value={vehicleDetails.vehicles[0].total_distance}
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

  function vehicleDetailsVehicle() {
    return (
      <div className="card lg:vehicle-side bg-base-100">
        <figure>
          <Image
            src={"/transportation.png"}
            alt="card"
            width="256"
            height="256"
            className="object-cover "
          />
        </figure>
        <div className="card-body">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Vehicle Name</div>
              <div className="stat-value">
                {vehicleDetails.vehicles[0].name}
              </div>
              <div className="stat-desc">
                {new Date(vehicleDetails.vehicles[0].created_at).toDateString()}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Details</div>
              <div className="">
                <table className="table w-full">
                  <tbody>
                    <tr>
                      <td>Vehicle Status</td>
                      <td>
                        {vehicleDetails.vehicles[0].status == "active" ? (
                          <div className="badge badge-success gap-2">
                            <div className="text-sm opacity-90">
                              {vehicleDetails.vehicles[0].status.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="badge badge-warning gap-2">
                            <div className="text-sm opacity-90">
                              {vehicleDetails.vehicles[0].status.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Vehicles Description</td>
                      <td>{vehicleDetails.vehicles[0].description}</td>
                    </tr>
                    <tr>
                      <td>License Plate</td>
                      <td>{vehicleDetails.vehicles[0].license_plate}</td>
                    </tr>
                    <tr>
                      <td>Passenger Capacity</td>
                      <td>{vehicleDetails.vehicles[0].passenger_capacity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end">
            {vehicleDetails.vehicles[0].status == "active" ? (
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
              Assgine Vehicle
            </label>

            {assigneVehicle()}

            {/* <label htmlFor="my-modal-4" className="btn modal-button">
              Update Vehicle
            </label>

            {updateVehicle()} */}
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

  function assigneVehicle() {
    return (
      <>
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assigne Vehicle</h3>
            <div className="py-4">{assgineVehicleForm()}</div>
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

  function updateVehicle() {
    return (
      <>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assigne Vehicle</h3>
            <div className="py-4">{updateVehicleForm()}</div>
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
            Vehicles Management - Vehicle Details
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {vehicleDetailsVehicle()}

              <div className="divider" />
              {/* {userVehicleDetails()} */}

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
