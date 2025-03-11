import { applets } from "@web-applets/sdk";

const context = applets.register();

type Card = { value: string; suit: string };

const suits = ["♠", "♥", "♦", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let deck: Card[] = [];
let playerHand: Card[] = [];
let dealerHand: Card[] = [];
let gameOver = false;
let message = "Your turn";

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function calculateScore(hand: Card[]): number {
  let score = 0;
  let aceCount = 0;

  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.value)) {
      score += 10;
    } else if (card.value === "A") {
      aceCount++;
      score += 11;
    } else {
      score += parseInt(card.value);
    }
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
}

function resetGame() {
  createDeck();
  playerHand = [deck.pop()!, deck.pop()!];
  dealerHand = [deck.pop()!, deck.pop()!];
  gameOver = false;
  message = "Your turn";

  checkBlackjack();

  updateContext();
}

function checkBlackjack() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore === 21 && dealerScore === 21) {
    message = "Blackjack! It's a tie!";
    gameOver = true;
  } else if (playerScore === 21) {
    message = "🎉 Blackjack! You win!";
    gameOver = true;
  } else if (dealerScore === 21) {
    message = "😢 Blackjack! Dealer wins!";
    gameOver = true;
  }
}

function checkWinner() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    message = "You lose! Busted!";
    gameOver = true;
  } else if (dealerScore > 21) {
    message = "Dealer busts! You win!";
    gameOver = true;
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      message = "You win!";
    } else if (playerScore < dealerScore) {
      message = "You lose!";
    } else {
      message = "It's a tie!";
    }
  }
}

function updateContext() {
  context.data = {
    playerHand,
    playerScore: calculateScore(playerHand),
    dealerHand,
    dealerScore: calculateScore(dealerHand),
    gameOver,
    message,
  };
}

context.setActionHandler("hit", () => {
  console.log("Hit action triggered");
  if (!gameOver) {
    playerHand.push(deck.pop()!);
    if (calculateScore(playerHand) > 21) {
      gameOver = true;
    }
    checkWinner();
    updateContext();
  }
});

context.setActionHandler("stand", () => {
  console.log("Stand action triggered");
  if (!gameOver) {
    while (calculateScore(dealerHand) < 17) {
      dealerHand.push(deck.pop()!);
    }
    gameOver = true;
    checkWinner();
    updateContext();
  }
});

context.setActionHandler("restart", () => {
  console.log("Restart action triggered");
  resetGame();
});

context.ondata = () => {
  console.log("Updated game state:", context.data);

  const playerElement = document.getElementById("player-cards");
  const dealerElement = document.getElementById("dealer-cards");
  const messageElement = document.getElementById("message");
  const playerScoreElement = document.getElementById("player-score");
  const dealerScoreElement = document.getElementById("dealer-score");

  if (playerElement && dealerElement && messageElement && playerScoreElement && dealerScoreElement) {
    playerElement.innerText = `Player: ${context.data.playerHand.map((card: Card) => card.value + card.suit).join(", ")}`;
    dealerElement.innerText = `Dealer: ${context.data.dealerHand.map((card: Card) => card.value + card.suit).join(", ")}`;
    playerScoreElement.innerText = `Score: ${context.data.playerScore}`;
    dealerScoreElement.innerText = `Score: ${context.data.dealerScore}`;
    messageElement.innerText = context.data.message;
  }
};

resetGame();

document.getElementById("hit-btn")?.addEventListener("click", () => {
  console.log("Hit button clicked");
  playerHand.push(deck.pop()!);
  if (calculateScore(playerHand) > 21) {
    gameOver = true;
  }
  checkWinner();
  updateContext();
});

document.getElementById("stand-btn")?.addEventListener("click", () => {
  console.log("Stand button clicked");
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop()!);
  }
  gameOver = true;
  checkWinner();
  updateContext();
});

document.getElementById("restart-btn")?.addEventListener("click", () => {
  console.log("Restart button clicked");
  resetGame();
});
