import { logout, requestNewOtp, submitNumber, verifyOtp } from "../../utils/auth.js";
import {
  baseUrl,
  getAndShowCityInHeader,
  getAndShowSocialsMedia,
  getCategories,
  showAllCitiesInModal,
  showMyDivarPanel,
} from "../../utils/shared.js";
import {
  addParamToUrl,
  getCityFromLocalStorage,
  saveCityInLocalStorage,
  getParamFromUrl,
  hideModalMostSearch,
  removeParamFromUrl,
  showModalMostSearch,
  isLogin,
} from "../../utils/utils.js";
import { setIconForCategory } from "./posts.js";

const globalSearchInput = document.querySelector("#global_search_input");
const removeSearchInputValue = document.querySelector(
  "#remove-search-value-icon"
);
const overlaySearchbarModal = document.querySelector(
  ".searchbar__modal-overlay"
);
const mostSearchContainer = document.querySelector("#most_searched");
const headerCity = document.querySelector(".header__city");
const cityModalAcceptBtn = document.querySelector(".city-modal__accept");
const cityModalCloseBtn = document.querySelector(".city-modal__close");
const cityModalError = document.querySelector("#city_modal_error");
const cityModal = document.querySelector(".city-modal__overlay");
const cityModalCities = document.querySelector(".city-modal__cities");
const cityModalSearchInput = document.querySelector("#city-modal-search-input");
let cityModalList = document.querySelector("#city_modal_list");
const headerCategoryBtn = document.querySelector(".header__category-btn");
const categoryModalOverlay = document.querySelector(".category_modal_overlay");
const allCategoriesPosts = document.querySelector("#all-categories-posts");
const categoriesList = document.querySelector("#categories-list");
const categoryResults = document.querySelector("#category-results");
const getSearchParams = getParamFromUrl("search");
const loginModalOverlay = document.querySelector(".login_modal_overlay");
const loginModalCloseIcon = document.querySelector(".login-modal__icon");
const submitPhoneNumberBtn = document.querySelector(".submit_phone_number_btn");
const loginBtn = document.querySelector(".login_btn");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const myDivarPanelBtn = document.querySelector(".dropdown-toggle");
let createPostBtn = document.querySelector(".create_post_btn");

let citySelectedContent = document.querySelector("#city-selected");
let deleteAllCities = document.querySelector("#delete-all-cities");
let selectedCities = [];
let allData = [];
let cities = getCityFromLocalStorage("cities");

// ??show city name in header
getAndShowCityInHeader();

getAndShowSocialsMedia();

// !search

const mostSearchkeyword = [
  "موبایل",
  "ساعت",
  "خانه",
  "کتاب",
  "استخدام",
  "املاک",
];
mostSearchkeyword.forEach((mostSearch) => {
  let categoryID = getParamFromUrl("categoryID");
  let href = `posts.html?search=${mostSearch}${
    categoryID ? `&categoryID=${categoryID}` : ""
  }`;
  mostSearchContainer?.insertAdjacentHTML(
    "beforeend",
    `
          <li class="header__searchbar-dropdown-item">
            <a href="${href}" class="header__searchbar-dropdown-link">${mostSearch}</a>
          </li>
      `
  );
});
globalSearchInput?.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    // location.href= `posts.html?search=${event.target.value.trim()}`

    addParamToUrl("search", event.target.value.trim());
    // if(event.target.value.trim()){
    // addParamToUrl('search',event.target.value.trim())
    //   }
  }
});

globalSearchInput?.addEventListener("click", () => {
  showModalMostSearch(
    "header__searchbar-dropdown",
    "header__searchbar-dropdown--active"
  );
});

overlaySearchbarModal?.addEventListener("click", () => {
  hideModalMostSearch(
    "header__searchbar-dropdown",
    "header__searchbar-dropdown--active"
  );
});

if (getSearchParams) {
  globalSearchInput.value = getSearchParams;
  removeSearchInputValue.style.display = "block";
}

globalSearchInput?.addEventListener("input", () => {
  if (globalSearchInput.value.trim()) {
    removeSearchInputValue.style.display = "block";
  } else {
    removeParamFromUrl("search");
    removeSearchInputValue.style.display = "none";
  }
});

removeSearchInputValue?.addEventListener("click", () => {
  removeParamFromUrl("search");
  removeSearchInputValue.style.display = "none";
});

headerCity?.addEventListener("click", () => {
  deleteAllCities.style.display = "block";
  showModalMostSearch("city-modal", "city-modal--active");
  cities = getCityFromLocalStorage("cities");
  selectedCities = cities;
  console.log(cities);
  addCityToModal(selectedCities);
});

const addCityToModal = (cities) => {
  citySelectedContent.innerHTML = "";
  cities.forEach((city) => {
    citySelectedContent.insertAdjacentHTML(
      "beforeend",
      `
    <div class="city-modal__selected-item">
            <span class="city-modal__selected-text">${city.name}</span>
            <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
              <i  class="city-modal__selected-icon bi bi-x"></i>
            </button>
          </div>
        `
    );
  });
  deleteAllCities.style.display = "block";
};

window.removeCityFromModal = (cityID) => {
  const liElemCity = document.getElementById(`city-${cityID}`);

  if (liElemCity) {
    const checkboxShape = liElemCity.querySelector("#checkboxShape");
    const checkboxElem = liElemCity.querySelector("#city-item-checkbox");
    checkboxShape.classList.remove("active");
    checkboxElem.checked = false;
  }
  console.log(selectedCities);
  selectedCities = selectedCities.filter((city) => city.id !== cityID);
  addCityToModal(selectedCities);
  toggleCityModalBtn(selectedCities);
};
// !show all cities in modal city click on header

showAllCitiesInModal().then((data) => {
  allData = data;
  showAllProvinces(data);
});

const showAllProvinces = (data) => {
  // **provinces

  cityModalList ? (cityModalList.innerHTML = "") : "";
  cityModalCities?.scrollTo(0, 0);
  data.provinces.forEach((province) => {
    cityModalList?.insertAdjacentHTML(
      "beforeend",
      `
      
      <li class="city-modal__cities-item province-item"
      data-province-id="${province.id}">
      <span>${province.name}</span>
      <i class="city-modal__cities-icon bi bi-chevron-left"></i>
      </li>
      
      `
    );
  });

  // **province cities

  let provincesItem = document.querySelectorAll(".province-item");

  provincesItem.forEach((provinces) => {
    provinces.addEventListener("click", (event) => {
      let provinceID = event.target.dataset.provinceId;
      let provinceName = event.target.querySelector("span").innerHTML;
      let allCities = data.cities;
      console.log(data);

      const provinceCities = allCities.filter(
        (cityID) => cityID.province_id === Number(provinceID)
      );
      cityModalList.innerHTML = "";

      cityModalList.insertAdjacentHTML(
        "beforeend",
        `
  <li onclick="backToProvincesList()" id="city_modal_all_province" class="city_modal_all_province">
              <span>همه شهر ها</span>
              <i class="bi bi-arrow-right-short"></i>
            </li>
            <li class="city-modal__cities-item select-all-city city-item">
              <span>همه شهر های ${provinceName}</span>
              <div id="checkboxShape"></div>
              <input type="checkbox" />
            </li>
  
  
  
  `
      );

      provinceCities.forEach((city) => {
        let isSelect = selectedCities.some(
          (selectedCities) => selectedCities.name == city.name
        );
        cityModalList.insertAdjacentHTML(
          "beforeend",
          `
          
      <li class="city-modal__cities-item city-item" id="city-${city.id}">
      <span>${city.name}</span>
      <div id="checkboxShape" class="${isSelect ? "active" : ""}"></div>
      <input onchange="cityItemClickHandler('${
        city.id
      }')" id="city-item-checkbox" type="checkbox" checked="${isSelect}"/>
      </li>
      `
        );
      });
    });
  });

  //? backToProvincesList
  window.backToProvincesList = () => {
    cityModalList.innerHTML = "";
    showAllProvinces(data);
  };
};

window.cityItemClickHandler = (cityID) => {
  const cityElem = document.querySelector(`#city-${cityID}`);
  const checkbox = cityElem.querySelector("#city-item-checkbox");
  const cityTitle = cityElem.querySelector("span").innerHTML;
  const checkboxShape = cityElem.querySelector("#checkboxShape");

  selectedCities.forEach((city) => {
    if (city.name == cityTitle) {
      checkboxShape.classList.add("active");
      checkbox.checked = true;
    }
  });

  checkbox.checked = !checkbox.checked;

  if (checkbox.checked) {
    checkboxShape.classList.add("active");
    updateSelectedCities(cityTitle, cityID);
    console.log("false");
  } else {
    console.log("true");

    checkbox.checked = true;
    checkboxShape.classList.remove("active");
    selectedCities = selectedCities.filter((city) => city.name !== cityTitle);
    addCityToModal(selectedCities);
    toggleCityModalBtn(selectedCities);
  }
};

const toggleCityModalBtn = (cities) => {
  if (cities.length) {
    cityModalAcceptBtn.classList.replace(
      "city-modal__accept",
      "city-modal__accept--active"
    );
    cityModalError.style.display = "none";
  } else {
    cityModalAcceptBtn.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept"
    );
    cityModalError.style.display = "block";
    deleteAllCities.style.display = "none";
  }
};

const updateSelectedCities = (cityTitle, cityID) => {
  const isTitleRepeater = selectedCities.some((city) => city.name == cityTitle);

  if (!isTitleRepeater) {
    selectedCities.push({ name: cityTitle, id: cityID });
    addCityToModal(selectedCities);
    toggleCityModalBtn(selectedCities);
  }
};

// ?click on accept & cancel btns in modal

cityModalAcceptBtn?.addEventListener("click", () => {
  saveCityInLocalStorage("cities", selectedCities);
  let citiesIDs = selectedCities.map((city) => city.id).join("|");
  // console.log(citiesIDs);
  addParamToUrl("cities", citiesIDs);
  hideModalMostSearch("city-modal", "city-modal--active");
  getAndShowCityInHeader();
  showAllProvinces(allData);
});
cityModalCloseBtn?.addEventListener("click", () => {
  hideModalMostSearch("city-modal", "city-modal--active");
  cityModalAcceptBtn.classList.replace(
    "city-modal__accept--active",
    "city-modal__accept"
  );
  getAndShowCityInHeader();
  showAllProvinces(allData);
});

cityModal?.addEventListener("click", () => {
  hideModalMostSearch("city-modal", "city-modal--active");
  getAndShowCityInHeader();
  showAllProvinces(allData);
});

// !!click on DELETE ALL BTN in city modal

deleteAllCities?.addEventListener("click", () => {
  selectedCities = [];
  unselectAllCitiesFromModal();
  addCityToModal(selectedCities);
  cityModalAcceptBtn.classList.replace(
    "city-modal__accept--active",
    "city-modal__accept"
  );
  cityModalError.style.display = "block";
  deleteAllCities.style.display = "none";
});

const unselectAllCitiesFromModal = () => {
  const allLiElem = document.querySelectorAll(".city-modal__cities-item");
  allLiElem.forEach((city) => {
    let checkbox = city.querySelector("input");
    let checkboxShape = city.querySelector("div");

    checkbox.checked = true;
    checkboxShape.classList.remove("active");
  });
  showAllProvinces(allData);
};
cityModalSearchInput?.addEventListener("keyup", (event) => {
  let searchInputValue = event.target.value;
  cityModalList.innerHTML = "";
  let searchCitiesValue = allData.cities.filter((city) =>
    city.name.startsWith(searchInputValue)
  );

  if (event.target.value.trim() && searchCitiesValue.length) {
    searchCitiesValue.forEach((city) => {
      let chooseCity = selectedCities.some(
        (selected) => selected.name == city.name
      );
      console.log(chooseCity);

      cityModalList.insertAdjacentHTML(
        "beforeend",
        `
        
        <li class="city-modal__cities-item city-item" id="city-${city.id}">
        <span>${city.name}</span>
        <div id="checkboxShape" class="${chooseCity ? "active" : ""}"></div>
        <input onchange="cityItemClickHandler(${
          city.id
        })" id="city-item-checkbox" type="checkbox" checked="${
          chooseCity ? "true" : "false"
        }">
        </li>
        
        `
      );
    });
  } else {
    cityModalList.innerHTML = "";
    console.log(allData);
    showAllProvinces(allData);
  }
});

// ! Finish Cities Modal

// **Start category modal in header دسته ها در هدر صفحه

headerCategoryBtn?.addEventListener("click", () => {
  showModalMostSearch("header__category-menu", "header__category-menu--active");
});

categoryModalOverlay?.addEventListener("click", () => {
  hideModalMostSearch("header__category-menu", "header__category-menu--active");
});

allCategoriesPosts?.addEventListener("click", () => {
  removeParamFromUrl("categoryID");
});

getCategories()
  .then((res) => res.json())
  .then((categories) => {
    categories.data.categories.forEach((category) => {
      categoriesList?.insertAdjacentHTML(
        "beforeend",
        `
       <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${
         category._id
       }')">
            <div class="header__category-menu-link">
              <div class="header__category-menu-link-right">
                <i class="header__category-menu-icon ${setIconForCategory(
                  category
                )}"></i>
                ${category.title}
              </div>
              <div class="header__category-menu-link-left">
                <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
              </div>
            </div>
          </li>
        
        `
      );
    });
    window.showActiveCategorySubs = (categoryID) => {
      const subCategory = categories.data.categories.find(
        (category) => category._id == categoryID
      );
      categoryResults ? (categoryResults.innerHTML = "") : "";
      subCategory.subCategories.forEach((subCategories) => {
        categoryResults?.insertAdjacentHTML(
          "beforeend",
          `
            <div>
            <ul class="header__category-dropdown-list">
            <div class="header__category-dropdown-title" onclick="categoryClickHandler('${
              subCategories._id
            }')">${subCategories.title}</div>

              ${subCategories.subCategories
                .map(
                  (sub) =>
                    `<li class="header__category-dropdown-item" onclick="categoryClickHandler('${sub._id}')">
                  <div class="header__category-dropdown-link">${sub.title}</div>
                  </li>`
                )
                .join("")}

            </ul>
            </div>
            
            
            `
        );
      });
    };

    window.categoryClickHandler = (ID) => {
      addParamToUrl("categoryID", ID);
    };
    showActiveCategorySubs(categories.data.categories[0]._id);
  });

loginModalOverlay?.addEventListener("click", () => {
  hideModalMostSearch("login-modal", "login-modal--active");
});
loginModalCloseIcon?.addEventListener("click", () => {
  hideModalMostSearch("login-modal", "login-modal--active");
});

submitPhoneNumberBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  submitNumber();
});

loginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  verifyOtp();
});

reqNewCodeBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  requestNewOtp();
});

// **دیوار من

myDivarPanelBtn?.addEventListener("click", () => {
  showMyDivarPanel();
});

// !ثبت اگهی
  let isUserLogin = isLogin();

  createPostBtn?.addEventListener('click',()=>{

    if(isUserLogin){
     location.href='./new.html'
      
    }else{
      hideModalMostSearch("login-modal", "login-modal--active");
    }
  })
  