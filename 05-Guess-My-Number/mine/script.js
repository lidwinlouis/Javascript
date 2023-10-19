'use strict';

/*
console.log(document.querySelector('.message').textContent);
document.querySelector('.message').textContent = 'Correct number!';
console.log(document.querySelector('.message').textContent);
document.querySelector('.score').textContent = '17';

document.querySelector('.guess').value = '23';
console.log(document.querySelector('.guess').value);
*/

//Selecting the input from the .guess inpt box on click event on .check button   using event listeners
let secretNumber = Math.trunc(Math.random() * 20) + 1;
console.log('The secret number is ', secretNumber);
let score = 20;
let hightestScore = 0;

document.querySelector('.check').addEventListener('click', function () {
  let userInput = Number(document.querySelector('.guess').value);

  if (!userInput) {
    document.querySelector('.message').textContent = 'Enter between 1 and 20!';
  } else {
    if (userInput === secretNumber) {
      if (score > hightestScore) {
        hightestScore = score;
      }
      document.querySelector('body').style.backgroundColor = '#60b347';
      document.querySelector('.number').style.width = '30rem';
      document.querySelector('.highscore').textContent = hightestScore;
      document.querySelector('.message').textContent = 'Correct Number !';
    } else if (userInput !== secretNumber) {
      if (score > 0) {
        score--;
        document.querySelector('.message').textContent =
          userInput < secretNumber ? 'Number too low !' : 'Number too high !';
        document.querySelector('.score').textContent = score;
      }
    }
  }
  if (score === 0) {
    document.querySelector('.message').textContent = 'Game Over!!';
  }
});

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  document.querySelector('.message').textContent = 'Start guessing !';
  document.querySelector('.score').textContent = score;
  document.querySelector('.highscore').textContent = hightestScore;
  document.querySelector('.guess').value = '';
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  console.log('The secret number is ', secretNumber);
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});
