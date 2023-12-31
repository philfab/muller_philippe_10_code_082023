import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [isPaused, setIsPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus 
  ? data.focus.sort((evtA, evtB) => new Date(evtA.date) > new Date(evtB.date) ? -1 : 1)
  : [];
  const nextCard = () => {
    setIndex(index < byDateDesc.length - 1 ? index + 1 : 0); // byDateDesc.length = longueur tableau donc -1 pour index base 0
  };

  // pas à chaque rendu sinon nextCard executé à chaque fois (pas necessaire)
  // effect ne nettoie pas le settimeout (bugs)
  useEffect(() => {
    if (byDateDesc && byDateDesc.length && !isPaused) {
      const timer = setTimeout(nextCard, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [index, byDateDesc, isPaused]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.code === "Space") {
        setIsPaused(!isPaused);
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isPaused]);

  return (
    <div className="SlideCardList">
    {isPaused ? <div data-testid="slider-status">Paused</div> : <div data-testid="slider-status">Not Paused</div>}
      {byDateDesc?.map((event, idx) => (
        // erreur avec syntaxe courte des fragments (key obligatoire avec .map . React.Fragment ne fonctionne pas donc div
        <div key={event.title}>
          <div
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
                  key={`radio-${evt.title}`} // pas event ni id dans map donc title comme index
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx} // idx boucle externe donc toujours derniere valeur donc index
                  readOnly // indique que les radio ne sont pas cliquables (pas de onchange)
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
