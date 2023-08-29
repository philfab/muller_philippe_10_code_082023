
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Home from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "2 espaces de restaurations",
        "1 site web dédié",
      ],
    },

    {
      id: 2,
      type: "forum",
      date: "2022-05-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
};


describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);

      fireEvent.click(await screen.findByText("Envoyer"));
      await screen.findByText("En cours");

      // attend que le texte "en cours" disparaisse
      await waitFor(
        () => {
          expect(screen.queryByText("En cours")).not.toBeInTheDocument();
        },
        {
          timeout: 1100, // attendre +1s (mock)
        }
      );

      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  
  it("a list of events is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
  
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
  
    expect(await screen.findByTestId("event-card")).toBeInTheDocument();
    const eventList = await screen.getAllByTestId("card-testid").filter(card => !card.classList.contains("EventCard--small"));
    expect(eventList.length).toEqual(2);// 2 cartes attendues celles de data qui n'ont pas la classe EventCard--small (last)
  });

  it("a list a people is displayed", () => {
    render(<Home />);
    const peopleList = screen.getAllByTestId("people-card");
    expect(peopleList.length).toEqual(6);
  });

  it("a footer is displayed", () => {
    render(<Home />);
    const footer = screen.getByRole("contentinfo"); // ARIA  contentinfo = footer
    expect(footer).toBeInTheDocument();
  });

  it("an event card, with the last event, is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
  
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
  
    expect(await screen.findByTestId("event-card")).toBeInTheDocument();
    const eventList = await screen.getAllByTestId("card-testid").filter(card => card.classList.contains("EventCard--small"));
    expect(eventList.length).toEqual(1);// 1 carte attendue celle de last qui possède la classe EventCard--small
  });

});
