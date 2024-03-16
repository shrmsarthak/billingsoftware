import data from "../assets/data/countries+states.json";

export function getAllCountry() {
  let t = [];
  data.map((v, i) => {
    t.push({ text: v.name, value: v.name });
  });
  return t;
}

export function getStates(country) {
  let s = [];
  data.map((v, i) => {
    if (v.name == country) {
      v.states.map((stat) => {
        s.push({ text: stat.name, value: stat.name });
      });
    }
  });
  return s;
}

export function getCities(state) {
  let cities = [];
  data.forEach((country) => {
    country.states.forEach((selectedState) => {
      if (selectedState.name === state) {
        selectedState.cities.forEach((city) => {
          cities.push({ text: city.name, value: city.name });
        });
      }
    });
  });
  return cities;
}

export function getFilterCities() {
  let filteredCities = [];
  let count = 0;
  data.forEach((country) => {
    country.states.forEach((state) => {
      state.cities.forEach((city) => {
        if (count < 500) {
          filteredCities.push({
            text: `${city.name}, ${state.name}, ${country.name}`,
            value: `${city.name}, ${state.name}, ${country.name}`,
          });
          count++;
        } else {
          return filteredCities;
        }
      });
    });
  });
  return filteredCities;
}
