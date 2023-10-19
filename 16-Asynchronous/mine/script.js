'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, display, neighbourClass) {
  const html = `<article class="country ${neighbourClass}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} million people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>`;
  if (display) {
    countriesContainer.insertAdjacentHTML('beforeend', html);
    //This is now moved to the finally block
    //countriesContainer.style.opacity = 1;
  }
};

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  //And make it visible even in error - This is now moved to the finally block
  //countriesContainer.style.opacity = 1;
};

///////////////////////////////////////
/////// AJAX Different ways ///////////
console.log('****************OLD Ways - XMLHttpRequest****************');

//////////////////// The Old way  ///////////////
//1) Create the XMLHttpRequest object
//2) use .open (method and url)
//3) use .send()
//4) Wait for the load event.
const getCountryDetail = function (country) {
  const request = new XMLHttpRequest();
  request.open(
    'GET',
    `https://restcountries.eu/rest/v2/name/${country}?fullText=true`
  );
  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    renderCountry(data, false, '');
  });
};
getCountryDetail('portugal');
getCountryDetail('mexico');
getCountryDetail('canada');
getCountryDetail('india');
console.log(`Result rendering is diabled with a boolean to renderCountry(). `);

console.log('****************Newer Ways - Promises ****************');
//The below block is commented because instead of returning a fetch() promise , i used .then() in the inner level,
// again leading to the callback hell  - COMMON MISTTAKE VIDEO - 249
// const getCountryDetails = function (country) {
//   //fetch() method immediately returns a Promise which will be in the below state(s).
//   //This can be chained using resolve or reject functions in the .then() or using .catch()
//   //First Pending => Then Settled ( Either Fulfilled or Rejected )
//   //The response.json() function also returns another promise and therefore we can chain on the returned
//   //promise object using then() [Assuming success]
//   fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
//     .then(response => response.json())
//     .then(data => {
//       const [countryData] = data;
//       renderCountry(countryData, true, '');
//       //Destructuring to fetch the first element from the array of borders.
//       const [neighbour] = countryData.borders;
//       //guard clause
//       if (!neighbour) return;
//       fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
//         .then(res => res.json())
//         .then(data => {
//           renderCountry(data, true, 'neighbour');
//           //Another level of neighbour
//           const [neighbour1] = data.borders;
//           //guard clause
//           if (!neighbour1) return;
//           fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour1}`)
//             .then(res => res.json())
//             .then(data => {
//               renderCountry(data, true, 'neighbour');
//             });
//         });
//     });
// };

//ALWAYS return a Promise and continue to handle the chain outside using  resolve or reject functions in the .then() or using .catch(). This method is later refactored to getCountryInformations()
const getCountryDetails = function (country) {
  //fetch() method immediately returns a Promise which will be in the below state(s).
  //This can be chained using a .then() or error()
  //First Pending => Then Settled ( Either Fulfilled or Rejected )
  //The response.json() function also returns another promise and therefore we can chain on the returned
  //promise object using then() [Assuming success]
  fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
    .then(response1 => {
      //When an error is thrown, the Promise gets rejected and caught in the catch() block
      if (!response1.ok)
        throw new Error(`Country not Found(${response1.status})`);
      return response1.json();
    })
    .then(data => {
      const [countryData] = data;
      renderCountry(countryData, true, '');
      //Destructuring to fetch the first element from the array of borders.
      const [neighbour] = countryData.borders;
      //guard clause
      if (!neighbour) return;
      return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(response2 => response2.json())
    .then(neighbourData1 => {
      renderCountry(neighbourData1, true, 'neighbour');
      const [neighbour] = neighbourData1.borders;
      //guard clause
      if (!neighbour) return;
      return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(response3 => response3.json())
    .then(neighbourData2 => {
      renderCountry(neighbourData2, true, 'neighbour');
    })
    .catch(err => {
      //Catch also returns a Promise
      console.error('Error Caught : ', err.message);
      renderError(`Something went wrong. Try again!!! ${err.message}`);
    })
    .finally(function () {
      countriesContainer.style.opacity = 1;
      console.log('Finally , Always invoked !!');
    });
};

//Refactored variant of getCountryDetails()
const getCountryInformations = function (country) {
  //fetch() method immediately returns a Promise which will be in the below state(s).
  //This can be chained using a .then() or error()
  //First Pending => Then Settled ( Either Fulfilled or Rejected )
  //The response.json() function also returns another promise and therefore we can chain on the returned
  //promise object using then() [Assuming success]
  getJson(
    `https://restcountries.eu/rest/v2/name/${country}?fullText=true`,
    'Country not Found!! '
  )
    .then(data => {
      const [countryData] = data;
      renderCountry(countryData, true, '');
      //Destructuring to fetch the first element from the array of borders.
      const [neighbour] = countryData.borders;
      //guard clause
      if (!neighbour) throw new Error('No neighbour found!');
      return getJson(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not Found. '
      );
    })
    .then(neighbourData1 => {
      renderCountry(neighbourData1, true, 'neighbour');
      const [neighbour] = neighbourData1.borders;
      //guard clause
      if (!neighbour) throw new Error('No neighbour found!');
      return getJson(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not Found. '
      );
    })
    .then(neighbourData2 => {
      renderCountry(neighbourData2, true, 'neighbour');
    })
    .catch(err => {
      //Catch also returns a Promise
      console.error('Error Caught : ', err.message);
      renderError(`${err.message}`);
    })
    .finally(function () {
      countriesContainer.style.opacity = 1;
      console.log('Finally , Always invoked !!');
    });
};

const getJson = function (url, message = 'Something went wrong!, ') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${message} (${response.status})`);
    return response.json();
  });
};

//Commented temporarily
getCountryInformations('portugal');

console.log('****************Building Promises ****************');

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('lotteryPromise() : Lottery Draw is happeing now.. !');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('lotteryPromise() : You won the lottery...!!');
    } else {
      reject(new Error('lotteryPromise() : Sorry! You lost your money...'));
    }
  }, 1000);
});

lotteryPromise
  .then(res => console.log(res))
  .catch(err => console.log(err.message));

//Simulating a timer /setTimeout using promises
//reject inside the evaltor function can be ignore as we are not rejecting here.
const wait = function (seconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, seconds * 1000);
  });
};

//Consuming the promise and returning another promise.
//This is a way of achieving the same thing which was done by Callback Hell.
wait(1)
  .then(res => {
    console.log('wait() : I waited for 1 seconds');
    return wait(1);
  })
  .then(res => {
    console.log('wait() : I waited for 2 seconds');
    return wait(1);
  })
  .then(res => {
    console.log('wait() : I waited for 3 seconds');
    return wait(1);
  })
  .then(res => {
    console.log('wait() : I waited for 4 seconds');
    return wait(1);
  });

//Callback Hell
// setTimeout(() => {
//   console.log('I waited for 1 second');
//   setTimeout(() => {
//     console.log('I waited for 2 seconds');
//     setTimeout(() => {
//       console.log('I waited for 3 seconds');
//       setTimeout(() => {
//         console.log('I waited for 4 seconds');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

//This will happen before the above promises which has a delay coded into it.
Promise.resolve('immediately resolved').then(x => console.log(x));
Promise.reject('immediately rejected').catch(x => console.error(x));

//Promisifying GEO Postition API
console.log('Fetching position - BEGIN');

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err)
    );
    //SAME AS ABOVE
    // navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getPosition()
//   .then(position => console.log('Promise Resolved ', position))
//   .catch(err => console.log('Promise Rejected ', err));
// console.log('Fetching position - Async Call to follow');

const whereAmI = function () {
  //Using GeoCOde
  getPosition()
    .then(position => {
      const { latitude: lat, longitude: lng } = position.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(
        `https://restcountries.eu/rest/v2/name/${data.country}?fullText=true`
      );
    })
    .then(result => {
      if (!result.ok) throw new Error(`Country not found (${result.status})`);
      return result.json();
    })
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0], true, '');
    })
    .catch(err => console.error(`${err.message} ðŸ’¥`))
    .finally(function () {
      countriesContainer.style.opacity = 1;
      console.log('Finally , Always invoked !!');
    });
};
btn.addEventListener('click', function () {
  // getCountryInformations('portugal');
  /*****Using Geo COde to get the Country from coordinates and then use chaining of promises to render the country****/
  //whereAmI();
  /*****Using Async Await ****/
  whereIsMyCountry('germany');
});

console.log('**************** Async Await ****************');
//It works like a .then().catch(). Its syntactic sugar. await returns a promise and we can assign
//the value to variables that can be then used in the subsequent statements.
const whereIsMyCountry = async function (country) {
  const position = await getPosition();
  const { latitude: lat, longitude: lng } = position.coords;
  try {
    const geoLoc = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    const geoResp = await geoLoc.json();
    // console.log(geoResp, geoLoc);
    if (!geoLoc.ok) throw new Error('Error getting geocode');
    //geoResp will hae the contry that can be used below . Here the service throttle reached hence hard coding
    const resp = await fetch(
      `https://restcountries.eu/rest/v2/name/${geoResp.country}?fullText=true`
    );
    if (!resp.ok) throw new Error('Error getting country details');
    const data = await resp.json();

    renderCountry(data[0], true, '');
    countriesContainer.style.opacity = 1;
    return `You are currently in ${geoResp.city}, ${geoResp.state}, ${geoResp.country}`;
  } catch (err) {
    console.log(err.message);
    //Throwing so that Promise is rejected when error occurs. else it will be resolved()
    throw err;
  }
};

//Unless a caught error is rethrown , the the async function always returns a fulfilled promise even when error occurs.
//Chaining like below ensures that statment 3. is executed last and the resolve or reject is handled second.
//This is again mixing asyc await with .then.catch;

// console.log(`1. Will get location `);
// whereIsMyCountry('')
//   .then(res => console.log(`2. ${res}`))
//   .catch(err => console.log(`2. ${err.message}`))
//   .finally(() => console.log(`3. Finished getting location `));

//Alternate is to use async await in the below using IIFE ( immediately invoked function expression)\
console.log(
  '***** Async Await With IIFE(Immediately Invoked Function Expression)*****'
);

(async function () {
  console.log(`1. Will get location `);
  try {
    const resp = await whereIsMyCountry('');
    console.log(`2. ${resp}`);
  } catch (err) {
    console.log(`2. ${err.message}`);
  }
  console.log(`3. Finished getting location `);
  console.log(
    '***** Async Await With IIFE(Immediately Invoked Function Expression)*****'
  );
})();

console.log(
  '*****Promise Combinators-Parallel Promises with Async Functions*****'
);
console.log('***** Promise.all() *****');

//Using Promise.all([p1, p2, p3...]) in an Aysnc function to combine multiple promises,
//such that they are executed in parallel. Useful when different promises are not dependent
//on response from previous promise. Promise.all return a Promise. If one promise in the grouped promises,
//gets rejected, Promise.all will also get rejected.
const getCaptials = async function (c1, c2, c3) {
  try {
    const data = await Promise.all([
      getJson(
        `https://restcountries.eu/rest/v2/name/${c1}?fullText=true`,
        'Country not Found!! '
      ),
      getJson(
        `https://restcountries.eu/rest/v2/name/${c2}?fullText=true`,
        'Country not Found!! '
      ),
      getJson(
        `https://restcountries.eu/rest/v2/name/${c3}?fullText=true`,
        'Country not Found!! '
      ),
    ]);
    //can also use .then .catch on 'data' as it is also a Promise.
    console.log(
      'getCaptials() ::',
      data.map(d => d[0].capital)
    );
  } catch (error) {
    console.error('getCaptials() ::', error.message);
  }
};

getCaptials('usa', 'mexico', 'portugal');

console.log('***** Promise.race() *****');
//In the Promise.race([p1, p2, p3,...]) all promises race against each other and the first promise to reach the
//Settled state (fulfilled or rejected) will be the winning promise and that fulfillment/rejection is returned
//as the response of the whole set. So we get only one result and thats from the winning promise
const racePromise = async function (c1, c2, c3) {
  try {
    const winner = await Promise.race([
      getJson(
        `https://restcountries.eu/rest/v2/name/${c1}?fullText=true`,
        'Country not Found!! '
      ),
      getJson(
        `https://restcountries.eu/rest/v2/name/${c2}?fullText=true`,
        'Country not Found!! '
      ),
      getJson(
        `https://restcountries.eu/rest/v2/name/${c3}?fullText=true`,
        'Country not Found!! '
      ),
    ]);
    if (!winner) return;
    //can also use .then .catch on 'data' as it is also a Promise.
    console.log(
      `racePromise() :: Capital of ${winner[0].name} - ${winner[0].capital}`
    );
  } catch (error) {
    console.error('racePromise() ::', error.message);
  }
};
racePromise('egypt', 'italy', 'germany');

console.log('***** Promise.race() - timeout promise *****');

//Promise.race([]) can be very useful when you have a lot of Promises ( some of which may be long running) that we
//want to finish with the earliest response Or inscenarios were we can race all promises against a timeout promise
//which will reject after a set timeout. This would mean that none of the promises gets settled within the time given
// in the timeout promise, the entre race will be based on the Reject response from the timeout promise.

const timeoutPromise = function (sec) {
  return new Promise(function (_resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeoutPromise() : Request took too long'));
    }, sec * 1000);
  });
};

const raceWithTimeout = async function (c1, c2, c3) {
  Promise.race([
    getJson(
      `https://restcountries.eu/rest/v2/name/${c1}?fullText=true`,
      'Country not Found!! '
    ),
    getJson(
      `https://restcountries.eu/rest/v2/name/${c2}?fullText=true`,
      'Country not Found!! '
    ),
    getJson(
      `https://restcountries.eu/rest/v2/name/${c3}?fullText=true`,
      'Country not Found!! '
    ),
    timeoutPromise(1),
  ])
    .then(res => console.log('raceWithTimeout() ::', res[0]))
    .catch(err => console.error('raceWithTimeout() :: ', err.message));
};
raceWithTimeout('india', 'ireland', 'nigeria');

//Very recent additon to JS , is Promise.allSettled([]) ; similar to Promise.all() but differs in that it does not
//reject when one of the Promise rejects, unlike in Promise.all(). Instead it returns an array of all Settled Promises
//fulfilled or rejected.
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log('Promise.allSettled : ', res))
  .catch(err => console.log('Promise.allSettled : ', err.message));

//Returns when first reject is observed, or all promises are resolved.
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log('Promise.all: ', res))
  .catch(err => console.log('Promise.all : ', err));

//Ignores all rejects and returns first success
Promise.any([
  Promise.reject('Error'),
  Promise.resolve('Success 1'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log('Promise.any: ', res))
  .catch(err => console.log('Promise.any : ', err));
