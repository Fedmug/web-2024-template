import { useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import { Typography, Button } from "@mui/material";

interface Card {
  rank: string;
  suit: string;
  image: string;
}

interface Player {
  id: number;
  name: string;
  position: "north" | "south" | "east" | "west";
  cards: Card[];
}

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-areas:
    ". north ."
    "west center east"
    ". south .";
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: 180px 1fr 160px;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #076324;
  overflow: hidden;
  position: relative;
`;

const PlayerSection = styled.div<{ position: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  ${(props) => {
    if (props.position === "south") {
      return `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
      `;
    }
    if (props.position === "east") {
      return `
        grid-area: east;
        margin-top: -40px;
      `;
    }
    if (props.position === "north") {
      return `
        grid-area: north;
      `;
    }
    if (props.position === "west") {
      return `
        grid-area: west;
      `;
    }
    return "";
  }}
`;

const CardDisplay = styled.div<{ position: string }>`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 0;
  margin-top: 0.5rem;

  ${(props) => {
    switch (props.position) {
      case "west":
        return `
          flex-direction: row;
          .suit-group {
            img {
              margin-right: -40px;
            }
            &:last-child img:last-child {
              margin-right: 0;
            }
          }
        `;
      case "east":
        return `
          flex-direction: column;
          .suit-group {
            margin-bottom: -30px;
            display: flex;
            flex-direction: row;
            
            img {
              margin-right: -40px;
            }
            
            &:last-child {
              margin-bottom: 0;
            }
            
            img:last-child {
              margin-right: 0;
            }
          }
        `;
      case "south":
        return `
          margin-top: 0;
          .suit-group {
            margin-right: 10px;
            
            img {
              margin-right: -40px;
            }
            
            &:last-child {
              margin-right: 0;
            }
            
            img:last-child {
              margin-right: 0;
            }
          }
        `;
      default:
        return `
          .suit-group {
            margin-right: 10px;
            
            img {
              margin-right: -40px;
            }
            
            &:last-child {
              margin-right: 0;
            }
            
            img:last-child {
              margin-right: 0;
            }
          }
        `;
    }
  }}
`;

const CardImage = styled.img<{ position: string }>`
  width: 70px;
  height: 100px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`;

const CenterSection = styled.div`
  grid-area: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  && {
    margin: 1rem;
    background-color: #d4af37;
    color: white;
    &:hover {
      background-color: #c4a030;
    }
  }
`;

const PlayerName = styled(Typography)`
  && {
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
`;

function App() {
  const [players, setPlayers] = useLocalStorageState<Player[]>("players", {
    defaultValue: [],
  });

  const generateDeck = (): Card[] => {
    const suits = ["S", "H", "D", "C"];
    const ranks = ["A", "K", "Q", "J", "0", "9", "8", "7"];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        const imageUrl = `https://www.deckofcardsapi.com/static/img/${rank}${suit}.png`;
        const suitSymbol =
          suit === "S" ? "♠" : suit === "H" ? "♥" : suit === "D" ? "♦" : "♣";

        const displayRank = rank === "0" ? "10" : rank;

        deck.push({
          rank: displayRank,
          suit: suitSymbol,
          image: imageUrl,
        });
      }
    }
    return deck;
  };

  const shuffleCards = () => {
    const deck = generateDeck();
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const prikup = deck.slice(30, 32);

    const newPlayers: Player[] = [
      { id: 1, name: "Трус", position: "north", cards: deck.slice(0, 10) },
      { id: 2, name: "Балбес", position: "east", cards: deck.slice(10, 20) },
      { id: 3, name: "Бывалый", position: "south", cards: deck.slice(20, 30) },
      { id: 4, name: "Прикуп", position: "west", cards: prikup },
    ];

    setPlayers(newPlayers);
  };

  useEffect(() => {
    if (players.length === 0) {
      shuffleCards();
    }
  }, []);

  const sortCards = (cards: Card[]) => {
    // Порядок мастей: ♠(S) ♥(H) ♣(C) ♦(D)
    const suitOrder = { S: 0, H: 1, C: 2, D: 3 };
    const rankOrder: { [key: string]: number } = {
      A: 0,
      K: 1,
      Q: 2,
      J: 3,
      "10": 4,
      "9": 5,
      "8": 6,
      "7": 7,
    };

    return [...cards].sort((a, b) => {
      const suitA = Object.keys(suitOrder).find(
        (key) =>
          a.suit ===
          (key === "S" ? "♠" : key === "H" ? "♥" : key === "C" ? "♣" : "♦")
      );
      const suitB = Object.keys(suitOrder).find(
        (key) =>
          b.suit ===
          (key === "S" ? "♠" : key === "H" ? "♥" : key === "C" ? "♣" : "♦")
      );

      if (suitA && suitB) {
        if (suitOrder[suitA] !== suitOrder[suitB]) {
          return suitOrder[suitA] - suitOrder[suitB];
        }
      }
      return rankOrder[a.rank] - rankOrder[b.rank];
    });
  };

  const groupCardsBySuit = (cards: Card[]) => {
    const sortedCards = sortCards(cards);
    const groups: { [key: string]: Card[] } = {};

    sortedCards.forEach((card) => {
      if (!groups[card.suit]) {
        groups[card.suit] = [];
      }
      groups[card.suit].push(card);
    });

    return groups;
  };

  return (
    <AppContainer>
      {players.map((player) => (
        <PlayerSection key={player.id} position={player.position}>
          <PlayerName variant="h5">{player.name}</PlayerName>
          <CardDisplay position={player.position}>
            {Object.entries(groupCardsBySuit(player.cards)).map(
              ([suit, cards]) => (
                <div key={suit} className="suit-group">
                  {cards.map((card, index) => (
                    <CardImage
                      key={index}
                      src={card.image}
                      alt={`${card.rank}${card.suit}`}
                      position={player.position}
                    />
                  ))}
                </div>
              )
            )}
          </CardDisplay>
        </PlayerSection>
      ))}
      <CenterSection>
        <StyledButton variant="contained" onClick={shuffleCards}>
          Перемешать и раздать
        </StyledButton>
      </CenterSection>
    </AppContainer>
  );
}

export default App;
