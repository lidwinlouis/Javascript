'use strict';

const playerOneSection = document.querySelector('.player--0');
const playerTwoSection = document.querySelector('.player--1');
const scoreOneElement = document.querySelector('#score--0');
const scoreTwoElement = document.getElementById('score--1');
const diceElement = document.querySelector('.dice');

const newBtnElement = document.querySelector('.btn--new');
const holdBtnElement = document.querySelector('.btn--hold');
const rollBtnElement = document.querySelector('.btn--roll');

const currScoreOneElement = document.getElementById('current--0');
const currScoreTwoElement = document.getElementById('current--1');

let playing, currentScore, activePlayer, scores;

const init = function () {
  //Starting condition
  scoreOneElement.textContent = 0;
  scoreTwoElement.textContent = 0;
  currScoreOneElement.textContent = 0;
  currScoreTwoElement.textContent = 0;
  diceElement.classList.add('hidden');
  playerOneSection.classList.remove('player--winner');
  playerTwoSection.classList.remove('player--winner');
  playerOneSection.classList.add('player--active');
  playerTwoSection.classList.remove('player--active');

  playing = true;
  currentScore = 0;
  activePlayer = 0;
  scores = [0, 0];
};

init();

const switchActivePlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 1 ? 0 : 1;
  playerOneSection.classList.toggle('player--active');
  playerTwoSection.classList.toggle('player--active');
  currentScore = 0;
};

//Rolling the dice
rollBtnElement.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    console.log('Dice :: ', dice);
    diceElement.classList.remove('hidden');
    diceElement.src = `dice-${dice}.png`;

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;
    } else {
      switchActivePlayer();
    }
  }
});

holdBtnElement.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    if (scores[activePlayer] >= 100) {
      playing = false;
      diceElement.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
    } else {
      switchActivePlayer();
    }
  }
});

newBtnElement.addEventListener('click', init);
