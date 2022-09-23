import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Field, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import IsLoadingUI from "../../../comps/IsLoading";
import {
  changeUserStatus,
  useGetUserDetails,
  stateUser,
} from "../../../queries/useUser";
import {
  changeCardStatus,
  getCardDetails,
  topUpCard,
  useGetCardDetails,
  assgineCard,
} from "../../../queries/useCard";

export default function CardDetails(props) {
  const { data: session } = useSession();
  if (session === "loading") {
    return <p>Loading</p>;
  }
  const url = props.backendURL;
  const id = useRouter().query.id;

  const {
    data: cardDetails,
    isLoading: isLoadingCardDetails,
    isError: isErrorCardDetails,
    refetch: cardRefetch,
  } = useGetCardDetails({ url, id });

  const cardStatusMutation = useMutation(changeCardStatus, {
    onSettled: () => cardRefetch(),
  });

  const handleUpdateStatus = (e) => {
    cardStatusMutation.mutate({
      id,
      url,
      status: e.target.value,
    });
  };

  const cardTopUpMutation = useMutation(topUpCard, {
    onSettled: () => cardRefetch(),
  });

  const cardAssigneMutation = useMutation(assgineCard, {
    onSettled: () => cardRefetch(),
  });
  if (isLoadingCardDetails) return <IsLoadingUI />;
  // console.log(cardDetails.cards[0].History? cardDetails.cards[0].History : "sdf")
  function topup() {
    return (
      <Formik
        initialValues={{
          topUpAmmount: 0,
        }}
        onSubmit={async (values) => {
          cardTopUpMutation.mutate({
            url,
            id: cardDetails.cards[0].id,
            incrementBy: values.topUpAmmount,
            currentBalance: cardDetails.cards[0].current_balance,
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
  function assgineCardForm() {
    return (
      <Formik
        initialValues={{
          userId: "",
        }}
        onSubmit={async (values) => {
          cardAssigneMutation.mutate({
            url,
            cardId: cardDetails.cards[0].id,
            userId: values.userId,
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
                  id="userId"
                  name="userId"
                  placeholder="Enter User Id"
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

  function cardDetailsCard() {
    return (

      <div className="card lg:card-side bg-base-100">
        <figure>
          <Image
            src={"/credit-cards.png"}
            alt="Card"
            width="512"
            height="512"
            className="object-cover "
          />
        </figure>
        <div className="card-body">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Card Serial ID</div>
              <div className="stat-value">
                {cardDetails.cards[0].card_serial_id}
              </div>
              <div className="stat-desc">
                {new Date(cardDetails.cards[0].created_at).toDateString()}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Details</div>
              <div className="">
                <table className="table w-full">
                  <tbody>
                    <tr>
                      <td>Card Status</td>
                      <td>
                        {cardDetails.cards[0].status == "active" ? (
                          <div className="badge badge-success gap-2">
                            <div className="text-sm opacity-90">
                              {cardDetails.cards[0].status.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="badge badge-warning gap-2">
                            <div className="text-sm opacity-90">
                              {cardDetails.cards[0].status.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Current Balance</td>
                      <td>{cardDetails.cards[0].current_balance}</td>
                    </tr>
                    <tr>
                      <td>Previous Balance</td>
                      <td>{cardDetails.cards[0].previous_balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end">
            {cardDetails.cards[0].status == "active" ? (
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

            <label htmlFor="my-modal-5" className="btn modal-button">
              Top Up
            </label>
            {topUpModel()}

            {cardDetails.cards[0].user_id == null ? (
              <label htmlFor="my-modal-4" className="btn modal-button">
                Assgine Card
              </label>
            ) : (
              ""
            )}
            {assigneCard()}
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

  function assigneCard() {
    return (
      <>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assigne User</h3>
            <div className="py-4">{assgineCardForm()}</div>
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
            Cards Management - Card Details
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid ">
              {cardDetailsCard()}

              <div className="divider" />
              {cardHistory()}

              {/* <div className="divider" /> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );

  function cardHistory() {
    // return {cardDetails.cards[0].History? "" : ""}
    return (

      <div className="overflow-x-auto w-full">
        <p>Card History</p>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Distance Traveled</th>
              <th>Cost</th>
              <th>Previous Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cardDetails.cards[0].History.map((h) => (
              <tr key={h.id}>
                <td>
                  {h.distance_traveled} Km
                  <br />
                  <span className="badge badge-ghost badge-sm"> {h.gps_coordinate_start} - {h.gps_coordinate_end}</span>
                </td>
                <td>

                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-bold">Rs {h.total_cost}</div>
                      <div className="text-sm opacity-50">{h.create_at}</div>
                    </div>
                  </div>
                </td>
                <td>{h.current_card_balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
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
