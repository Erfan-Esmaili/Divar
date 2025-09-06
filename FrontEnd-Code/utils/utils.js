import { baseUrl } from "./shared.js";

const saveCityInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getCityFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const addParamToUrl = (key, value) => {
  let url = new URL(window.location.href);
  let param = url.searchParams;
  param.set(key, value);
  url.search = param.toString();
  location.href = url.search;
};

const getParamFromUrl = (value) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(value);
};

const removeParamFromUrl = (value) => {
  const url = new URL(location.href);
  url.searchParams.delete(value);
  window.history.replaceState(null, null, url);
  location.reload();
};

const calculateRealtime = (date) => {
  let currentTime = new Date();
  let createTime = new Date(date);

  let TimeDifference = currentTime - createTime;
  let hours = Math.floor(TimeDifference / (1000 * 60 * 60));
  let days = Math.floor(hours / 24);

  if (days >= 365) {
    let years = Math.floor(days / 365);
    let remainingDays = days % 365;
    let months = Math.floor(remainingDays / 30);


    if (months >= 1) {
      return `${years} سال و ${months}ماه پیش`;
    } else {
      return `${years} سال پیش`;
    }
  } else if (days >= 30) {
    let months = Math.floor(days / 30);
    let remainingDays = days % 30;

    if (remainingDays > 0) {
      return `${months}ماه و ${remainingDays} روز پیش`;
    } else {
      return `${months} ماه پیش`;
    }
  } else if (days >= 1) {
    return `${days} روز پیش`;
  } else {
    return `${hours} ساعت پیش`;
  }
};

const showModalMostSearch = (elemId, className) => {
  const element = document.querySelector(`#${elemId}`);
  element?.classList.add(className);
};
const hideModalMostSearch = (elemId, className) => {
  const element = document.querySelector(`#${elemId}`);
  element?.classList.remove(className);
};

const showSwal = (title, icon, buttons, callback) => {
  swal({ title, icon, buttons }).then((result) => {
    callback(result);
  });
};

const getToken = () => {
  const token = getCityFromLocalStorage("Token");
  return token;
};

const isLogin = async () => {
  const token = getToken();

  if (!token) {
    return false;
  } else {
    const res = await fetch(`${baseUrl}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status == 200 ? true : false;
  }
};

const getMe = async () => {
  const token = getToken();

  if (!token) {
    return false;
  } else {
    const res = await fetch(`${baseUrl}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.json();
    return data;
  }
};

const pagination = (
  href,
  paginationContainer,
  currentPage,
  totalItems,//کلا چندتا صفحه باشه
  itemPrePage //کلا چندتا ایتم در هر صفحه نمابش بشه
) => {
  paginationContainer.innerHTML = "";
  let paginatedCount = Math.ceil(totalItems / itemPrePage);

  for (let i = 1; i < paginatedCount + 1; i++) {

paginationContainer.insertAdjacentHTML(
        "beforeend",`
        
        <li class="${i===Number(currentPage) ?'active' : ''}">
        <a href="${href}?page=${i}">${i}</a>
        
        </li>
        
        `

)
  }

  
};

export {
  saveCityInLocalStorage,
  getCityFromLocalStorage,
  addParamToUrl,
  calculateRealtime,
  getParamFromUrl,
  removeParamFromUrl,
  showModalMostSearch,
  hideModalMostSearch,
  showSwal,
  isLogin,
  getToken,
  getMe,
  pagination
};
