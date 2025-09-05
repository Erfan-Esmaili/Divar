import { baseUrl, getAllCities } from "../../../utils/shared.js";
import { getParamFromUrl, getToken, showSwal } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const categoryDetails = document.querySelector(".category_details p");
  const dynamicFields = document.querySelector("#dynamic-fields");
  const registerBtn = document.querySelector("#register-btn");
  const citySelectBox = document.querySelector("#city-select");
  const neighborhoodSelectBox = document.querySelector("#neighborhood-select");
  const uploader = document.querySelector("#uploader");
  const imagesContainer = document.querySelector("#images-container");
  const postPriceInput = document.querySelector("#post-price-input");
  const exchangeCheckbox = document.querySelector("#exchange-checkbox");
  const postDescriptionTextarea = document.querySelector(
    "#post-description-textarea"
  );
  const postTitleInput = document.querySelector("#post-title-input");
  let markerIcon = null;
  const getCategoryId = getParamFromUrl("categoryID");
  const res = await fetch(`${baseUrl}/v1/category/sub`);
  const response = await res.json();
  const categories = response.data.categories;
  const categoryFields = {};
  let pictures = [];
  const categoryNameTitle = categories.find(
    (categoryID) => categoryID._id == getCategoryId
  );

  categoryDetails.innerHTML = categoryNameTitle.title;

  categoryNameTitle.productFields.map((fields) => {
    // console.log(fields);
    dynamicFields.insertAdjacentHTML(
      "beforeend",
      `
      ${
        fields.type == "selectbox"
          ? `
      
          <div class="group">
                  <p class="field-title">${fields.name}</p>
                  <div class="field-box">
                    <select required="required"  onchange="fieldChangeHandler('${
                      fields.slug
                    }',event.target.value)">
                      <option value="default">انتخاب</option>

                      ${fields.options.map(
                        (option) =>
                          `<option value="${option}">${option}</option>`
                      )}
                      
                    </select>
                    <svg>
                      <use xlink:href="#select-arrow-down"></use>
                    </svg>
                  </div>
                  <svg class="sprites">
                    <symbol id="select-arrow-down" viewbox="0 0 10 6">
                      <polyline points="1 1 5 5 9 1"></polyline>
                    </symbol>
                  </svg>
                </div>
      
      
      `
          : `
          <div class="group checkbox-group">
                  <input class="checkbox" type="checkbox" onchange="fieldChangeHandler('${fields.slug}',event.target.checked)">
                  <p>${fields.name}</p>
                </div> 
      
      `
      }

    
    `
    );
  });
  window.fieldChangeHandler = (slug, data) => {
    console.log({ slug, data });
    categoryFields[slug] = data;
  };
  categoryNameTitle.productFields.forEach((fields) => {
    if (fields.type == "checkbox") {
      categoryFields[fields.slug] = false;
    } else {
      categoryFields[fields.slug] = null;
    }
  });
  // !city-choices library

  getAllCities().then((allCities) => {
    const cityChoices = new Choices(citySelectBox);
    const neighborhoodChoices = new Choices(neighborhoodSelectBox);

    const tehranNeighborhood = allCities.data.neighborhoods.filter(
      (neighborhood) => neighborhood.city_id === 301
    ); //?301 is tehran code

    const choices = [
      {
        value: "default",
        label: "انتخاب محله",
        disabled: true,
        selected: true,
      },
      ...tehranNeighborhood.map((neighborhoods) => ({
        value: neighborhoods.id,
        label: neighborhoods.name,
      })),
    ];
    neighborhoodChoices.setChoices(choices, "value", "label", false);

    cityChoices.setChoices(
      allCities.data.cities.map((city) => ({
        value: city.id,
        label: city.name,
        customProperties: { id: city.id },
        selected: city.name == "تهران" ? true : false,
      })),
      "value",
      "label",
      false
    );
    citySelectBox.addEventListener("addItem", (event) => {
      neighborhoodChoices.clearStore();
      const neighborhoods = allCities.data.neighborhoods.filter(
        (neighborhood) =>
          neighborhood.city_id == event.detail.customProperties.id
      );
      console.log(neighborhoods);
      if (neighborhoods.length) {
        const neighborhoodChoicesConfig = [
          {
            value: "default",
            label: "انتخاب محله",
            selected: true,
            disabled: true,
          },
          ...neighborhoods.map((neighborhood) => ({
            value: neighborhood.id,
            label: neighborhood.name,
          })),
        ];
        neighborhoodChoices.setChoices(
          neighborhoodChoicesConfig,
          "value",
          "label",
          false
        );
      } else {
        neighborhoodChoices.setChoices(
          [
            {
              value: 0,
              label: "محله ای یافت نشد",
              disabled: true,
              selected: true,
            },
          ],
          "value",
          "label",
          false
        );
      }
    });
  });

  // !upload images
  uploader.addEventListener("change", (event) => {
    if (event.target.files.length) {
      let files = event.target.files[0];
      if (
        files.type == "image/png" ||
        files.type == "image/jpg" ||
        files.type == "image/jpeg"
      ) {
        pictures.push(files);
        generateImage(pictures);
      } else {
        showSwal(
          "نوع فایل شما باید png یا jpg یا jpeg باشد",
          "error",
          "باشه",
          () => {}
        );
      }
    }
  });

  const generateImage = (pics) => {
    imagesContainer.innerHTML = "";
    pics.forEach((pic) => {
      let reader = new FileReader();
      reader.onload = function () {
        let src = reader.result;
        imagesContainer.insertAdjacentHTML(
          "beforeend",
          `
          <div class="image-box">
              <div>
                <i class="bi bi-trash" onclick="deleteImage('${pic.name}')"></i>
              </div>
            <img src="${src}" alt="post-images">
          </div>
          
          `
        );
      };
      reader.readAsDataURL(pic);
    });
    console.log(pictures);
  };

  window.deleteImage = (picName) => {
    pictures = pictures.filter((pic) => pic.name !== picName);
    generateImage(pictures);
  };

  // ?Map
  const mapIconControll = document.querySelector(".icon-controll");
  let mapView = { x: 35.715298, y: 51.404343 };
  let map = L.map("map").setView([35.715298, 51.404343], 13);
  // let iconStatus =
  let firstIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [35, 35],
  });
  let secondIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==",
    iconSize: [35, 35],
  });

  markerIcon = firstIcon; //*default

  let mapMarker = L.marker([35.715298, 51.404343], { icon: markerIcon }).addTo(
    map
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  map.on("move", () => {
    const center = map.getSize().divideBy(2);
    const targetPoint = map.containerPointToLayerPoint(center);
    const targetLatting = map.layerPointToLatLng(targetPoint);

    mapMarker.setLatLng(targetLatting);

    mapView = {
      x: targetLatting.lat,
      y: targetLatting.lng,
    };
  });

  L.control
    .locate({
      position: "topleft", // کنار دکمه زوم
      flyTo: true, // زوم به موقعیت کاربر
      keepCurrentZoomLevel: false,
      strings: { title: "نمایش موقعیت من" },
      showPopup: true, // نمایش popup با مختصات
      showAccuracyCircle: true, // دایره دقت
      locateOptions: { enableHighAccuracy: true },
    })
    .addTo(map);

  mapIconControll.addEventListener("change", (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      markerIcon = secondIcon;
      mapMarker.setIcon(markerIcon);
    } else {
      markerIcon = firstIcon;
      mapMarker.setIcon(markerIcon);
    }
  });

  // !Handle Register Btn And اتشار نهایی اگهی

  registerBtn.addEventListener("click", async () => {
    // ?Dynamic fields
    let allFieldsFilled = true;
    for (const key in categoryFields) {
      if (categoryFields[key] === null) {
        console.log("asd");
        allFieldsFilled = false;
      }
    }

    if (
      allFieldsFilled &&
      postPriceInput.value.trim() &&
      neighborhoodSelectBox.value != "default" &&
      postDescriptionTextarea.value.trim() &&
      postTitleInput.value.trim()
    ) {
      const formData = new FormData();
      formData.append("city", citySelectBox.value);
      formData.append("neighborhood", neighborhoodSelectBox.value);
      formData.append("title", postTitleInput.value);
      formData.append("description", postDescriptionTextarea.value);
      formData.append("price", postPriceInput.value);
      formData.append("exchange", exchangeCheckbox.checked);
      formData.append("map", JSON.stringify(mapView));
      formData.append("categoryFields", JSON.stringify(categoryFields));
      pictures.map((pic) => formData.append("pics", pic));

      const res = await fetch(`${baseUrl}/v1/post/${getCategoryId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (res.status == 201) {
        console.log(formData);

        showSwal(
          "آگهی شما با موفقیت در صف انتظار قرار گرفت",
          "success",
          "باشه",
          () => {
            location.href = "../userPanel/posts/preview.html";
          }
        );
      }
    } else {
      showSwal("تمامی فیلد ها را تکمیل کنید", "error", "باشه", () => {});
    }
  });
});
