import { baseUrl } from "./shared.js";
import {
  hideModalMostSearch,
  saveCityInLocalStorage,
  showModalMostSearch,
  showSwal,
} from "./utils.js";

const messageLoginFormError = document.querySelector(
  ".step-1-login-form__error"
);
const messageOtpError = document.querySelector(".step-2-login-form__error");
const phoneNumberInput = document.querySelector(".phone_Number_input");
const userNumberNotice = document.querySelector(".user_number_notice");
const requestTimerContent = document.querySelector(".request_timer");
const requestTimer = document.querySelector(".request_timer span");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const loadingContainer = document.querySelector("#loading-container");
const codeOtpInput = document.querySelector(".code_input");

const submitNumber = async () => {
  const phoneRegex = RegExp(/^(09)[0-9]{9}$/);
  const phoneNumber = phoneNumberInput.value.trim();
  const isValidPhoneNumber = phoneRegex.test(phoneNumber);
  loadingContainer.classList.add("active-login-loader");

  if (isValidPhoneNumber) {
    loadingContainer.classList.add("active-login-loader");
    messageLoginFormError.innerHTML = "";
    await fetch(`${baseUrl}/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    }).then((res) => {
      if (res.status == 200) {
        loadingContainer.classList.remove("active-login-loader");
        showModalMostSearch("login-modal", "active_step_2");
        userNumberNotice.innerHTML = phoneNumber;
        let count = 30;
        requestTimer.innerHTML = "30";
        requestTimerContent.style.display = "flex";
        let timer = setInterval(() => {
          count--;
          requestTimer.innerHTML = count;
          if (count === 0) {
            reqNewCodeBtn.style.display = "block";
            requestTimerContent.style.display = "none";
            clearInterval(timer);
          }
        }, 1000);
      }
    });
  } else {
    messageLoginFormError.innerHTML = "شماره تماس وارد شده معتبر نیست";
    loadingContainer.classList.remove("active-login-loader");
  }
};

const verifyOtp = async () => {
  loadingContainer.classList.add("active-login-loader");
  const otpRegex = RegExp(/^\d{4}$/);
  const userOtp = codeOtpInput.value.trim();
  const isValidOtp = otpRegex.test(userOtp);

  if (isValidOtp) {
    await fetch(`${baseUrl}/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumberInput.value.trim(),
        otp: userOtp,
      }),
    }).then(async (res) => {
      if (res.status == 200) {
        const response = await res.json();
        saveCityInLocalStorage("Token", response.data.token);

        loadingContainer.classList.remove("active-login-loader");
        hideModalMostSearch("login-modal", "login-modal--active");
        showSwal(
          "ورود با موفقیت انجام شد",
          "success",
          "ورود به پنل کاربری",
          () => {
            location.href = "./userPanel/verify.html";
          }
        );
        codeOtpInput.value = "";
      } else if (res.status == 201) {
        const response = await res.json();
        saveCityInLocalStorage("Token", response.data.token);
        loadingContainer.classList.remove("active-login-loader");
        hideModalMostSearch("login-modal", "login-modal--active");
        showSwal("به دیوار خوش آمدید", "success", "ورود به پنل کاربری", () => {
          location.href = "./userPanel/verify.html";
        });
        codeOtpInput.value = "";
      } else if (res.status == 400) {
        messageOtpError.innerHTML = "کد اشتباه است";
        loadingContainer.classList.remove("active-login-loader");
      }
    });
  } else {
    loadingContainer.classList.remove("active-login-loader");
    messageOtpError.innerHTML = "کد اشتباه است";
  }
};

const requestNewOtp = async () => {
  reqNewCodeBtn.style.display = "none";

  await fetch(`${baseUrl}/v1/auth/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: phoneNumberInput.value }),
  }).then((res) => {
    if (res.status == 200) {
      showModalMostSearch("login-modal", "active_step_2");
      userNumberNotice.innerHTML = phoneNumberInput.value;
      let count = 30;
      requestTimer.innerHTML = "30";
      requestTimerContent.style.display = "flex";
      let timer = setInterval(() => {
        count--;
        requestTimer.innerHTML = count;
        if (count === 0) {
          reqNewCodeBtn.style.display = "block";
          requestTimerContent.style.display = "none";
          clearInterval(timer);
        }
      }, 1000);
    }
  });
};

const logout = () => {
  showSwal(
    "آیا از خروج از حساب کاربری مطمئنید؟",
    "warning",
    ["خیر", "بله"],
    (result) => {
      if (result) {
        localStorage.removeItem("Token");

        showSwal("خروج با موفقیت انجام شد", "success", "تایید", () => {
          location.href = "FrontEnd-Code/index.html";
        });
      }
    }
  );
};
export { submitNumber, verifyOtp, requestNewOtp, logout };
