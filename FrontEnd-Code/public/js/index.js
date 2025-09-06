import { getAllCities } from "../../utils/shared.js";
import { saveCityInLocalStorage } from "../../utils/utils.js";

window.addEventListener("load", () => {
  const loadingContainer = document.querySelector("#loadingContent");
  const searchInputElem = document.querySelector("#search-input");
  const SearchResultContent = document.querySelector(".search-result-cities");

  loadingContainer.classList.add("d-none");
  getAllCities().then((response) => {
    const popularCitiesContainer = document.querySelector("#popular-cities");
    const popularCities = response.data.cities.filter((city) => city.popular);

    searchInputElem.addEventListener("keyup", (event) => {
      if (event.target.value.length) {
        SearchResultContent.classList.add("active");
        SearchResultContent.innerHTML = "";

        const searchCities = response.data.cities.filter((city) =>
          city.name.startsWith(event.target.value)
        );
        if (searchCities.length) {
          SearchResultContent.innerHTML = "";
          searchCities.forEach((result) => {
            SearchResultContent.insertAdjacentHTML(
              "beforeend",
              `
            <li onclick="cityClickHandler('${result.name}' ,'${result.id}' )">${result.name}</li>
            `
            );
          });
        } else {
          SearchResultContent.innerHTML = "";
          SearchResultContent.insertAdjacentHTML(
            "beforeend",
            `
            <li class="alert alert-danger">شهری یافت نشد</li>
            `
          );
        }
      } else {
        SearchResultContent.classList.remove("active");
      }
    });

    popularCities.forEach((city) => {
      popularCitiesContainer.insertAdjacentHTML(
        "beforeend",
        `
        <li class="main__cities-item">
            <p class="main__cities-link" onclick="cityClickHandler('${city.name}' ,'${city.id}')">${city.name}</p>
        </li>
      `
      );
    });
  });

  window.cityClickHandler = (cityName, cityID) => {
    saveCityInLocalStorage("cities",[{name: cityName, id:cityID}]);
    location.href = "FrontEnd-Code/pages/posts.html  ";
  };
});
