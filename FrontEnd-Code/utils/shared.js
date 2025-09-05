import { logout } from "./auth.js";
import {
  getCityFromLocalStorage,
  getMe,
  getParamFromUrl,
  getToken,
  isLogin,
  saveCityInLocalStorage,
  showModalMostSearch,
} from "./utils.js";

const baseUrl = "https://divarapi.liara.run";

const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const cities = await res.json();
  return cities;
};

const getAndShowSocialsMedia = async () => {
  let footerSocialMediaContent = document.querySelector(
    "#footer__social-media"
  );
  await fetch(`${baseUrl}/v1/social/`)
    .then((res) => res.json())
    .then((socialMedia) => {
      socialMedia.data.socials.forEach((social) => {
        footerSocialMediaContent?.insertAdjacentHTML(
          "beforeend",
          `
            
              <a href="${social.link}" class="sidebar__icon-link">
    <img src="${social.icon}" alt="${social.name}" class="sidebar__icon bi bi-twitter">
  </a>
            
            
            `
        );
      });
    });
};

const getPosts = async (citiesID) => {
  let categoryID = getParamFromUrl("categoryID");
  let search = getParamFromUrl("search");
  let url = `${baseUrl}/v1/post/?city=${citiesID}`;
  if (categoryID) {
    url += `&categoryID=${categoryID}`;
  }
  if (search) {
    url += `&search=${search}`;
  }

  const res = await fetch(url);
  const posts = await res.json();
  return posts;
};

const getCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`);

  return res;
};

const getAndShowCityInHeader = () => {
  let headerCityTitle = document.querySelector("#header-city-title");
  let city = getCityFromLocalStorage("cities");
  if (!city) {
    saveCityInLocalStorage("cities", [{ name: "تهران", id: "031" }]);
    city = getCityFromLocalStorage("cities");
    headerCityTitle.innerHTML = city[0].name;
  } else {
    if (city.length == 1) {
      headerCityTitle ? (headerCityTitle.innerHTML = city[0].name) : "";
    } else {
      headerCityTitle.innerHTML = `${city.length}شهر`;
    }
  }
};

const showAllCitiesInModal = async () => {
  const res = await fetch(`${baseUrl}/v1/location/`);
  const modalCities = await res.json();

  return modalCities.data;
};

const getPostDetails = async () => {
  let postID = getParamFromUrl("id");
  let token = getToken();
  const res = await fetch(`${baseUrl}/v1/post/${postID}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const response = await res.json();
  return response.data.post;
};

// **MyDivar
const showMyDivarPanel = async () => {
  let headerDropdownMenu = document.querySelector(".header_dropdown_menu");
  headerDropdownMenu.innerHTML = "";
  let userLogin = await isLogin();

  if (headerDropdownMenu) {
    if (userLogin) {
      getMe().then((userData) => {
        headerDropdownMenu.insertAdjacentHTML(
          "beforeend",

          `
              <li class="header__left-dropdown-item header_dropdown-item_account">
                <a
                  href="FrontEnd-Code/pages/userPanel/posts.html"
                  class="header__left-dropdown-link login_dropdown_link"
                >
                  <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                  <div>
                    <span>کاربر دیوار </span>
                    <p>تلفن ${userData.data.user.phone}</p>
                  </div>
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="FrontEnd-Code/pages/userPanel/verify.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  تایید هویت
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="FrontEnd-Code/pages/userPanel/bookmarks.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  نشان ها
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="FrontEnd-Code/pages/userPanel/notes.html">
                  <i class="header__left-dropdown-icon bi bi-journal"></i>
                  یادداشت ها
                </a>
              </li>
              <li class="header__left-dropdown-item logout-link" id="logout_btn" onclick="handleLogout()">
                <p class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-shop"></i>
                  خروج
                </p>
              </li>
          `
        );
      });
    } else {
      headerDropdownMenu.insertAdjacentHTML(
        "beforeend",
        `
          <li class="header__left-dropdown-item">
            <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
              <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
              ورود
            </span>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link" href="#">
              <i class="header__left-dropdown-icon bi bi-bookmark"></i>
              نشان ها
            </div>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link" href="#">
              <i class="header__left-dropdown-icon bi bi-journal"></i>
              یادداشت ها
            </div>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link" href="#">
              <i class="header__left-dropdown-icon bi bi-clock-history"></i>
              بازدید های اخیر
            </div>
          </li>
        `
      );
      headerDropdownMenu.addEventListener("click", () => {
        showModalMostSearch("login-modal", "login-modal--active");
      });
    }
  }
};

const getSupportArticles = async () => {
  const res = await fetch(`${baseUrl}/v1/support/category-articles`);
  const response = await res.json();
  return response.data.categories;
};

const getArticleByID = async (id) => {
  const res = await fetch(`${baseUrl}/v1/support/articles/${id}`);
  const response = await res.json();
  return response.data.article;
};

const getArticleByCategory = async (id) => {
  const res = await fetch(`${baseUrl}/v1/support/categories/${id}/articles`);
  const response = await res.json();
  return response.data.articles;
};
const getArticles = async () => {
  const res = await fetch(`${baseUrl}/v1/support/category-articles`);
  const response = await res.json();
  return response.data.categories;
};

window.handleLogout = () => {
  logout();
};
export {
  baseUrl,
  getAllCities,
  getAndShowSocialsMedia,
  getPosts,
  getCategories,
  getAndShowCityInHeader,
  showAllCitiesInModal,
  getPostDetails,
  showMyDivarPanel,
  getSupportArticles,
  getArticleByID,
  getArticleByCategory,
  getArticles,
};
