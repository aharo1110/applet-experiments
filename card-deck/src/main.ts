import { applets } from "@web-applets/sdk";

const context = applets.register();

type Card = { value: number; suit: string };

let deck: Card[] = [];
let hand: Card[] = [];

function reset() {
  deck = [];
  hand = [];
  for (let suit of ["hearts", "diamonds", "clubs", "spades"]) {
    for (let value = 1; value <= 13; value++) {
      deck.push({ value, suit });
    }
  }

  context.data = { deck, hand };
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  context.data = { deck, hand };
}

function stringifyCard(card: Card) {
  const suitName = card.suit[0].toUpperCase() + card.suit.slice(1);
  let valueName = card.value.toString();

  if (valueName === "11") {
    valueName = "Jack";
  } else if (valueName === "12") {
    valueName = "Queen";
  } else if (valueName === "13") {
    valueName = "King";
  } else if (valueName === "1") {
    valueName = "Ace";
  }

  return `${valueName} of ${suitName}`;
}

function stringifyCards(cards: Card[]) {
  return `[${cards.map(stringifyCard).join(", ")}]`;
}

context.setActionHandler("reset", reset);
context.setActionHandler("shuffle", shuffle);
context.setActionHandler("draw", ({ count }: { count?: number }) => {
  count ??= 1;
  for (let i = 0; i < count && deck.length; i++) {
    hand.push(deck.pop()!);
  }

  context.data = { deck, hand };
});

// Whenever the data is updated, update the view
context.ondata = () => {
  const handElement = document.getElementById("hand");
  if (handElement) {
    handElement.innerText = stringifyCards(context.data.hand);
  }

  const deckElement = document.getElementById("deck");
  if (deckElement) {
    deckElement.innerText = stringifyCards(context.data.deck);
  }
};

reset();
