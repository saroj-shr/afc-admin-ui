import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";
import IsLoadingUI from "../../../comps/IsLoading";
import {
  changeUserStatus,
  useGetUserDetails,
  stateUser,
} from "../../../queries/useUser";

export default function UserDetails(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;
  const id = useRouter().query.id;

  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    isError: isErrorUserDetails,
    refetch: userRefetch,
  } = useGetUserDetails({ url, id });

  // // const {
  // //   data :
  // //  } = useChangeUserStatus();

  // const mutation = useMutation(stateUser, () => {
  //   on
  // })

  const mutation = useMutation(changeUserStatus, {
    onSettled: () => userRefetch(),
  });
  const handleUpdateStatus = (e) => {
    mutation.mutate({
      id,
      url,
      status: e.target.value,
    });
  };

  if (isLoadingUserDetails) return <IsLoadingUI />;
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Users Management - User Details
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {userDetailsCard()}

              <div className="divider" />
              {userCardDetails()}

              {/* <div className="divider" /> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );

  function userCardDetails() {
    return (
      <>
        {userDetails.users[0].Cards === null ? (
          <div className="stats ">
            <div className="stat">
              <div className="stat-title">Card ID</div>
              <div className="stat-value">Card not found</div>
              <div className="stat-actions">
                <Link href={"/cards"}>
                  <button className="btn btn-sm btn-success">Add Card</button>
                </Link>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Current balance</div>
              <div className="stat-value">---</div>
              <div className="stat-actions">
                <button className="btn btn-sm btn-disabled">
                  Card Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="stats ">
            <div className="stat">
              <div className="stat-title">Card ID</div>
              <div className="stat-value">
                {userDetails.users[0].Cards.card_serial_id}
              </div>
              <div className="stat-desc">
                {userDetails.users[0].Cards.status == "active" ? (
                  <div className="badge badge-success gap-2">
                    <div className="text-sm opacity-90">
                      {userDetails.users[0].Cards.status.toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className="badge badge-warning gap-2">
                    <div className="text-sm opacity-90">
                      {userDetails.users[0].Cards.status.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Current balance</div>
              <div className="stat-value">
                {userDetails.users[0].Cards.current_balance}
              </div>
              <div className="stat-actions">
                <Link href={`/cards/card/${userDetails.users[0].Cards.id}`}>
                  <a className="btn btn-sm">Card Details</a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function userDetailsCard() {
    return (
      <div className="card lg:card-side bg-base-100">
        <figure>
          <Image
            src={"/AFdZucr5wAEquDpjKWO9PeAsBWXQOm3L89VhqJTFbvM2If8=l100-c"}
            alt={userDetails.users[0].firstName}
            width="512"
            height="512"
            className="object-cover "
          />
        </figure>
        <div className="card-body">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">User Name</div>
              <div className="stat-value">
                {userDetails.users[0].firstName +
                  " " +
                  userDetails.users[0].lastName}
              </div>
              <div className="stat-desc">
                {new Date(userDetails.users[0].created_at).toDateString()}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Details</div>
              <div className="">
                <table className="table w-full">
                  <tbody>
                    <tr>
                      <td>User Id</td>
                      <td>{userDetails.users[0].id} </td>
                    </tr>
                    <tr>
                      <td>Account Status</td>
                      <td>
                        {userDetails.users[0].status == "active" ? (
                          <div className="badge badge-success gap-2">
                            <div className="text-sm opacity-90">
                              {userDetails.users[0].status.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="badge badge-warning gap-2">
                            <div className="text-sm opacity-90">
                              {userDetails.users[0].status.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>User Type</td>
                      <td>
                        <div className="badge badge-success gap-2">
                          <div className="text-sm opacity-90">
                            {userDetails.users[0].userType.toUpperCase()}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{userDetails.users[0].email} </td>
                    </tr>

                    <tr>
                      <td>Phone Number</td>
                      <td>{userDetails.users[0].phoneName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end">
            {userDetails.users[0].status == "active" ? (
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

            {userDetails.users[0].Cards === null ? (
              <Link href={"/cards"}>
                <button className="btn btn-success">Add Card</button>
              </Link>
            ) : (
              ""
            )}
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

  return {
    props: { session, ...{ backendURL: process.env.BACKEND_URL } },
  };
}
