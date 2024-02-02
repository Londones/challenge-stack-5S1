import Calendar from "../components/calendar/Calendar";
import { Card } from "flowbite-react";
import { PrestationListGroup } from "../components/prestacomponents/PrestationListGroup";
import EmployesPrestation from "../components/EmployesPrestation";
import { useState, useCallback, useEffect } from "react";
import { Alert } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { ErrorComponent } from "../components/ErrorComponent";
import { getEmployePrestations } from "../services/prestations.service";
import useCachedData from "../hooks/useCachedData";

export default function Reservation() {
  const location = useLocation();
  const prestationId = location.state.prestationId;
  const [prestation, setPrestation] = useState([]);
  const [dataEmployesPrestation, setDataEmployesPrestation] = useState(null);
  const [employesPrestation, setEmployesPrestation] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const {
    data: response,
    isLoading,
    error,
  } = useCachedData(getEmployePrestations, prestationId);

  const memoizedCallback = useCallback(() => {
    if (response) {
      setEmployesPrestation(response.employes);
      const { employes, feedback, ...presta } = response;
      setPrestation([presta]);
    }
  }, [response]);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);

  const handleSelect = (data) => {
    setDataEmployesPrestation(data);
  };

  if (isLoading) {
    return (
      <div className="h-screen mt-52">
        <Spinner color="gray" size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full errorbg">
        <ErrorComponent status={error.status} />
      </div>
    );
  }

  const createReservation = async (selectedDateTime) => {
    const [datePart, timePart] = selectedDateTime.split(' ');

    
    try {
      const res = await axios.post(`https://127.0.0.1:8000/api/reservations`, {
        client: "/api/users/3",
        prestation: `/api/prestations/${prestationId}`,
        employe: "/api/employes/1",
        status: "created",
        creneau: timePart,
        duree: 0,
        jour: datePart,
      });


      if (res.status === 201) {
        setResponseMessage("Réservation confirmée");
        console.log(responseMessage);
      }

    } catch (error) {
      alert(prestationId);
      setResponseMessage(error.response.data.detail);
    }
  }


  return (
    response && (
      <div className="reservation h-full w-screen bg-gray-100">
        <div className="reservation-wrapper">
          <p className="normal-case text-gray-900 text-xl text-left title">
            1. Préstation sélectionnée
          </p>
          <PrestationListGroup prestations={prestation} linkTo={""} />
          <p className="normal-case text-gray-900 text-xl text-left title">
            2. Choix de l'employé
          </p>
          <EmployesPrestation
            employesPrestation={employesPrestation}
            handleSelect={handleSelect}
          />
          <p className="normal-case text-gray-900 text-xl text-left title">
            3. Choix de la date & heure
          </p>
          {responseMessage && <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-gray-800 dark:text-green-400" role="alert">
            <span class="font-medium"> {responseMessage} </span>
          </div>}
          {dataEmployesPrestation ? (
            <Calendar employeId={dataEmployesPrestation} createReservation={createReservation} />
          ) : (
            <Alert color="warning" withBorderAccent>
              <span>
                <span className="font-medium">
                  Veuillez séléctionner un employé.
                </span>
              </span>
            </Alert>
          )}
        </div>
      </div>
    )
  );
}
