import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );
  const nextCard = () => {
    setIndex(index < byDateDesc.length - 1 ? index + 1 : 0); // byDateDesc.length = longueur tableau donc -1 pour index base 0
  };

  // pas à chaque rendu sinon nextCard executé à chaque fois (pas necessaire)
  // effect ne nettoie pas le settimeout (bugs)
  useEffect(() => {
    if (byDateDesc && byDateDesc.length) {
      const timer = setTimeout(nextCard, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [index, byDateDesc]);

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((evt, radioIdx) => (
                <input
                  key={evt.title} // pas event ni id dans map donc title comme index
                  type="radio"
                  name="radio-button"
                  checked={index  === radioIdx} // idx boucle externe donc toujours derniere valeur donc index
                  readOnly // indique que les radio ne sont pas cliquables (pas de onchange)
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
