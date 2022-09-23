import { useSession, getSession } from "next-auth/react";
import { Formik, Field, Form } from "formik";
import Link from "next/link";

import {
  stateUsers,
  useGetAllUsers,
  getAllUsers,
  useGetUsersStats,
  getUsersStats,
} from "../../queries/useUsers";
import IsLoadingUI from "../../comps/IsLoading";
import Image from "next/image";

export default function Users(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;
  const stats = props.counts;

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useGetAllUsers({ url });

  if (isUsersLoading) return <IsLoadingUI />;

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Users Management
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {/* Stat */}
              {userStat()}

              {/* <div className="divider" /> */}

              {/* Input  */}
              {/* {userInput()} */}

              <div className="divider" />

              {/* Table */}
              <div className="grid ">
                <div>
                  <h2 className="text-xl font-bold mb-2">Users List</h2>
                </div>
                {routesTable()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );

  function userStat() {
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
          <div className="stat-title">Number of Users</div>
          <div className="stat-value">{stats.allCount}</div>
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
          <div className="stat-value">{stats.activeCount}</div>
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
          <div className="stat-value">{stats.inActiveCount}</div>
        </div>
      </div>
    );
  }


  function routesTable() {
    // console.log(users.users);
    if (users)
      return (
        <div className="w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Details</th>
                <th>User Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          {/* <img
                            src={user.imageURl}
                          /> */}

                          <Image
                            src={
                              "/AFdZucr5wAEquDpjKWO9PeAsBWXQOm3L89VhqJTFbvM2If8=l100-c"
                            }
                            layout="fill"
                            alt={user.firstName + " " + "image"}
                            className="object-cover "
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {user.firstName + " " + user.lastName}
                        </div>
                        {user.status === "active" ? (
                          <div className="badge badge-success gap-2">
                            <div className="text-sm opacity-90">
                              {user.status.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="badge badge-warning gap-2">
                            <div className="text-sm opacity-90">
                              {user.status.toUpperCase()}
                            </div>
                          </div>
                        )}

                        {/* <div className="text-sm opacity-50">{user.id}</div> */}
                        <div className="text-sm opacity-50">
                          {new Date(user.created_at).toDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.email}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {user.phoneName}
                    </span>
                  </td>
                  <td>
                    <div className="badge badge-accent">
                      {user.userType.toUpperCase()}
                    </div>
                  </td>
                  <th>
                    <Link href={`/users/user/${user.id}`}>
                      <button className="btn btn-ghost btn-xs">Details</button>
                    </Link>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
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
  const data = await getUsersStats({ url: process.env.BACKEND_URL });
  // console.log(JSON.stringify(data.data, null, 2));

  return {
    props: {
      session,
      ...{ backendURL: process.env.BACKEND_URL },
      ...{ counts: data },
    },
  };
}
