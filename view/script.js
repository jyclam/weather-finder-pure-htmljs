function Weather() {}

Weather.prototype.fetchResults = function (val) {
  const updateSuggestions = this.updateSuggestions.bind(this);

  fetch("https://jsonmock.hackerrank.com/api/weather?name=" + val)
    .then((response) => response.json())
    .then(({ data }) => {
      this.weatherResults = data;
      const cityNames = data.map((weatherObject) => weatherObject.name);
      updateSuggestions(cityNames);
    })
    .catch((error) => console.log(error));
};

Weather.prototype.onKeyup = function (e) {
  this.fetchResults(this.$city.value);
};

Weather.prototype.updatecitySelect = function (e) {
  const chosenCityWeather = this.weatherResults.find(
    (weatherObject) => weatherObject.name === e.target.innerHTML,
  );

  while (this.$suggestions.firstChild) {
    this.$suggestions.removeChild(this.$suggestions.lastChild);
  }

  this.$city.value = chosenCityWeather.name;

  this.$selectedCity.innerHTML = chosenCityWeather.name;
  this.$selectedWeather.innerHTML = chosenCityWeather.weather;
  this.$selectedStatus.innerHTML = chosenCityWeather.status.join(",");
};

Weather.prototype.updateSuggestions = function (cityNames) {
  if (cityNames.length === 0) {
    const element = document.createElement("div");
    element.innerHTML = "No results";
    element.classList.add("suggestionItem");
  }

  while (this.$suggestions.firstChild) {
    this.$suggestions.removeChild(this.$suggestions.lastChild);
  }

  const elements = cityNames.forEach((city) => {
    const element = document.createElement("div");
    element.innerHTML = city;
    element.classList.add("suggestionItem");
    this.$suggestions.appendChild(element);
  });
};

Weather.prototype.reset = function () {
  // reset button
  this.$city.value = "";
  this.weatherResults = [];

  this.$selectedCity.innerHTML = "";
  this.$selectedWeather.innerHTML = "";
  this.$selectedStatus.innerHTML = "";
};

Weather.prototype.init = function () {
  this.timer = null;
  this.weatherResults = [];
  this.$city = document.getElementById("city");
  this.$suggestions = document.getElementById("suggestions");
  this.$selectedInfo = document.getElementById("selectedCityInfo");
  this.$selectedCity = document.getElementById("selectedCity");
  this.$selectedWeather = document.getElementById("selctedWeather");
  this.$selectedStatus = document.getElementById("selectedStatus");
  this.$resetBtn = document.getElementById("resetBtn");
  this.$city.addEventListener("keyup", debounce(this.onKeyup.bind(this), 1000));
  this.$resetBtn.addEventListener("click", this.reset.bind(this));
  this.$suggestions.addEventListener("click", this.updatecitySelect.bind(this));
};

function debounce(fn, ms) {
  let timerId;

  return function debounced() {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(this, arguments);
      timerId = null;
    }, ms);
  };
}

var weatherApp = new Weather();
weatherApp.init();
