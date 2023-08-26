import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;
/* eslint-disable no-console */
const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState("Toutes"); // au lieu de null
  const [currentPage, setCurrentPage] = useState(1);

  // code de base : que type soit vrai ou faux retourne toujours data?.events
  // code de base :  pas de filtre par rapport à type mais index (?)
  // new :.filter > si type == 'Toutes' tous les événements sont retournés sinon par type
  // new : .slice().> sous-tableau pagination > si page 1 alors 0 à 8 si page 2  alors 9 à 17
  const filteredEvents = 
  data?.events
   /* ?.sort((evtA, evtB) => new Date(evtA.date) - new Date(evtB.date))// Tri par ordre croissant */
    ?.sort((evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)) // Tri par ordre décroissant 
    .filter((event) => type === "Toutes" || event.type === type)
    .slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
  || [];

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={changeType} // plus simple : on donne une fonction qui sera appelée avec le param newValue (Select)
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
