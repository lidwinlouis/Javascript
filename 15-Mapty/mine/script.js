'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//Parent class - Workout
class Workout {
  //Generate random id from current time in ms and get the last 10 digits
  id = Date.now().toString().slice(-10);
  date = new Date();
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = +distance;
    this.duration = +duration;
  }

  _setDescription() {
    //prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
      months[this.date.getMonth()]
    }  ${this.date.getFullYear()}`;
    return description;
  }

  //Sample for a public API
  //NOTE - Having both attribute name and method name as click caused issues
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.pace = this.calcPace();
    this.description = this._setDescription();
  }
  calcPace() {
    //min/km
    let _pace = this.duration / this.distance;
    return _pace.toFixed(2);
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.speed = this.calcSpeed();
    this.description = this._setDescription();
  }
  calcSpeed() {
    let _speed = (this.distance / this.duration) * 60;
    //Distance in KM and duration in minutes
    return _speed.toFixed(2);
  }
}

///////////////////////////////////////////////
////////// Application Architecture ///////////
class App {
  //Class level attributes in place of gobal variables.
  map;
  mapEvent;
  mapZoom = 13;
  workouts = [];

  //Event listerners defined in the constructor.
  constructor() {
    //Set user default position
    this._getPosition();

    //Get data from localstorage
    this._getLocalStorage();

    //Event Listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    //Actually in the _toggleElevationField method, this keyword is not used hence binding is not required.
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopUp.bind(this));
  }

  _getPosition() {
    // If navigator.geolocation is suppoted by the browser
    if (navigator.geolocation) {
      //Take note of the this._loadMap.bind(this)-.bind(this) is required for callbacks to get access to the, app object.
      // navigator.geolocation.getCurrentPosition( successcallback(), failurecallback())
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          console.log('Unable to get your current location');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coordinate = [latitude, longitude];
    // console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
    //Using Leaflet JS library which makes use of openstreetmap in this case.
    //Leaftlet can work with other maps as well. The second arg of setView(coordinate, zoom) is the zoom.
    this.map = L.map('map').setView(coordinate, this.mapZoom);
    //console.log(`Leaflet map object : `, this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', this._showForm.bind(this));

    //Load markers from localstorage once the map is ready
    const locdata = localStorage.getItem('workouts');
    if (!locdata) return;
    this.workouts = JSON.parse(locdata);
    this.workouts.forEach(work => {
      this._renderMarkerOnMap(work);
    });
  }

  _showForm(e) {
    form.classList.remove('hidden');
    inputDistance.focus();
    //console.log(` :: `, e);
    this.mapEvent = e;
  }

  _hideForm() {
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value =
      '';
    // When the hidden style is attached there is an animatin(as per css) which slides in.But what we want is to
    // remove the form immediately after pressing enter. So in order NOT to show the animation its first made
    // display:none and after a delay (giving time for the animation to playout while display is still none),
    // put back to display:grid as in the .css file.
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(function () {
      form.style.display = 'grid';
    }, 1000);
  }
  _toggleElevationField(e) {
    /*
        Onload selects Cycling-Cadence, then with each change keep toggling the hiddne class
        such that only one is displayed.
          inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
          inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    */
    //Or be more sure about the value in the option and add/remove hidden class
    if (e.target.value === 'running') {
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
      inputElevation.closest('.form__row').classList.add('form__row--hidden');
    } else if (e.target.value === 'cycling') {
      inputCadence.closest('.form__row').classList.add('form__row--hidden');
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
    }
  }

  _newWorkout(e) {
    e.preventDefault();
    //Two internal helper methods for data valiation
    const allNumbers = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    //Get input data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.mapEvent.latlng;
    let workout;
    let markerStyle;

    //Validating Data and Add Guard conditions
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !allNumbers(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        alert('Input fields should be Positive numbers');
        return;
      }
      markerStyle = 'running-popup';
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //console.log(!allNumbers(distance, duration, elevation));
      //console.log(!allPositive(distance, duration));
      if (
        !allNumbers(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        alert('Input fields should be Positive numbers');
        return;
      }
      markerStyle = 'cycling-popup';
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Add the workouts to the list
    this.workouts.push(workout);
    //console.dir(this.workouts);

    //Clear input fields and hide the form
    this._hideForm();

    //Add the marker on the map
    this._renderMarkerOnMap(workout);

    //Render the workout on the list
    this._renderWorkout(workout);

    //Set local storage
    this._setLocalstorage();
  }

  _renderMarkerOnMap(workout) {
    L.marker(workout.coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        }).setContent(
          `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
        )
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let speed = +workout.speed;
    let cadence = +workout.cadence;
    let elev = +workout.elevGain;
    //console.log(`Speed : `, speed);
    //console.log(`Cadence : `, cadence);
    //console.log(`Elevation : `, elev);
    const html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span> 
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${
        workout.type === 'running' ? workout.pace : workout.speed
      }</span>
      <span class="workout__unit">${
        workout.type === 'running' ? 'min/km' : 'km/h'
      }</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🦶🏼' : '⛰'
      }</span>
      <span class="workout__value">${
        workout.type === 'running' ? workout.cadence : workout.elevGain
      }</span>
      <span class="workout__unit">${
        workout.type === 'running' ? 'spm' : 'm'
      }</span>
    </div>
   </li>`;
    //Adding the generated HTML as SIBLING to the form
    form.insertAdjacentHTML('afterend', html);
  }

  //Where the element to which we want to attach an event listener is not available in the DOM from the
  //begining then we use event delegation by attaching the event to the parent and then look for the target.
  _moveToPopUp(e) {
    const el = e.target.closest('.workout');
    //Guard clause when el is null return
    if (!el) return;
    const workout = this.workouts.find(workout => workout.id === el.dataset.id);
    //console.dir(workout.coords);
    //https://leafletjs.com/reference-1.7.1.html#zoom/pan-options
    //Leaflet method setView([coordinates], zoom, {zoom/pan options})

    this.map.setView(workout.coords, this.mapZoom, {
      animate: true,
      duration: 1,
    });
    //This public method will cause issues when workouts array and thereby workout bojects are restored from
    //local storage. JSON.parse() cannot restore the Workout, Running or Cycling class objects. It will be a
    //generic object , therefore WE LOSE THE PROTOTYPE CHAINING while using localstorage
    //workout.click();
  }

  _setLocalstorage() {
    localStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  _getLocalStorage() {
    const loc = localStorage.getItem('workouts');
    if (!loc) return;
    this.workouts = JSON.parse(loc);
    this.workouts.forEach(work => {
      this._renderWorkout(work);
      //Rendering the markers(_renderMarkerOnMap) will not work at this point because the this.map object is not
      //yet available, as loading of the map is has not completed at this point
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    //Reload the page
    location.reload();
  }
}

const myApp = new App();
