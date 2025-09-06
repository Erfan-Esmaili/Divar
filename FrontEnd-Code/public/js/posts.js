import { getPosts, baseUrl, getCategories } from "../../utils/shared.js";
import {
  addParamToUrl,
  calculateRealtime,
  getCityFromLocalStorage,
  getParamFromUrl,
  removeParamFromUrl,
} from "../../utils/utils.js";

window.addEventListener("load", () => {
  let loadingContainer = document.getElementById("loading-container");
  let getIdCities = getCityFromLocalStorage("cities");
  let categoryIdParams = getParamFromUrl("categoryID");
  let categoriesArray = undefined;
  let posts = null;
  let backupPosts = null;
  let dynamicFilter = {}
  let cities = getCityFromLocalStorage("cities");

  // **title
  if(cities.length==1){
    document.title=`
    دیوار ${cities[0].name} - آگهی های رایگان خرید، فروش و استخدام | دیوار
    `
  }else{
    document.title=`
    دیوار ${cities.length}شهر - آگهی های رایگان خرید، فروش و استخدام | دیوار
  `
  }

 let citiesIDs= cities.map(city=>city.id).join('|')

  getPosts(citiesIDs).then((res) => {

    loadingContainer.classList.add("d-none");
    posts = res.data.posts;
    backupPosts = res.data.posts;
    generatePosts(posts);
  });

  const generatePosts = (posts) => {
    let postsContainer = document.querySelector("#posts-container");
   postsContainer? postsContainer.innerHTML = "":''
    
    if (posts.length) {
      posts.forEach((post) => {
        let days = calculateRealtime(post.createdAt);
        postsContainer?.insertAdjacentHTML(
          "beforeend",
          `
                          <div class="col-12 col-md-6 col-lg-4">
                            <a href="post.html?id=${
                              post._id
                            }" class="product-card">
                              <div class="product-card__right">
                                <div class="product-card__right-top">
                                  <p class="product-card__link">${
                                    post.title
                                  }</p>
                                </div>
                                <div class="product-card__right-bottom">
                                  <span class="product-card__condition">${
                                    post.dynamicFields[0].data
                                  }</span>
                                  <span class="product-card__price">
                                    ${
                                      post.price === 0
                                        ? "توافقی"
                                        : post.price.toLocaleString() + " تومان"
                                    }
                                  </span>
                                  <span class="product-card__time">${days}</span>
                                </div>
                              </div>
                              <div class="product-card__left">
                              ${
                                post.pics.length
                                  ? `
                                    <img
                                      class="product-card__img img-fluid"
                                      src="${baseUrl}/${post.pics[0].path}"
                                    />`
                                  : `
                                    <img
                                      class="product-card__img img-fluid"
                                      src="../public/images/main/noPicture.PNG"
                                    />`
                              }
                                
                              </div>
                            </a>
                          </div>
              
            
            
            `
        );
      });
    } else {
      postsContainer?.insertAdjacentHTML(
        "beforeend",
        `
          <div class="empty">آگهی یافت نشد</div>
          
          `
      );
    }
  };

  window.categoryClickHandler = (categoryID) => {
    addParamToUrl("categoryID", categoryID);
  };
  window.backToAllCategories = () => {
    removeParamFromUrl("categoryID");
  };

  getCategories()
    .then((res) => res.json())
    .then((categories) => {
      const categoriesContainer = document.querySelector(
        "#categories-container"
      );

      loadingContainer.classList.add("d-none");
      categoriesContainer.innerHTML = "";
      categoriesArray = categories.data.categories;

      if (categoryIdParams) {
        let categoriesInfos = categoriesArray.filter(
          (category) => category._id == categoryIdParams
        );

        if (!categoriesInfos.length) {
          const subCategories = findSubCategoryById(
            categoriesArray,
            categoryIdParams
          );

          subCategories?.filters.forEach((filter) => filterGenerator(filter));

          if (subCategories) {
            // *step3
            categoriesContainer?.insertAdjacentHTML(
              "beforeend",
              `
               <div class="all-categories">
                <p onclick="backToAllCategories()">همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link active-category" href="#" id="category-${
                subCategories._id
              }">
                <div class="sidebar__category-link_details">
                   <i class="sidebar__category-icon bi ${setIconForCategory(
                     categoriesArray.find(
                       (categoryID) => categoryID._id == subCategories.parent
                     )
                   )}""></i>
                  <p onclick=categoryClickHandler('${
                    subCategories._id
                  }')>${setTitleMainCategories(
                subCategories.parent,
                categoriesArray
              )}</p>
                </div>
                <ul class="subCategory-list">
                ${createSubCategoryHtml(subCategories)}
                </ul>
                <ul class="subCategory-list">
                  ${subCategories.subCategories
                    .map(createSubCategoryHtml)
                    .join("")}
                </ul>
              </div> 
            
            
            
            `
            );
          } else {
            //!subsubcategory
            // *step4
            const subSubCategories = findSubSubCategoryById(
              categoriesArray,
              categoryIdParams
            );
            const subSubCategoriesParent = findSubCategoryById(
              categoriesArray,
              subSubCategories.parent
            );
            subSubCategories?.filters.forEach((filter) =>
              filterGenerator(filter)
            );

            categoriesContainer?.insertAdjacentHTML(
              "beforeend",
              `
            
             <div class="all-categories">
                <p onclick="backToAllCategories()">همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>
              <div class="sidebar__category-link active-category" href="#">
              <div class="sidebar__category-link_details">
                 <i class="sidebar__category-icon bi ${setIconForCategory(
                   categoriesArray.find(
                     (categoryID) =>
                       categoryID._id == subSubCategoriesParent.parent
                   )
                 )}""></i>
                  <p onclick=categoryClickHandler('${
                    subSubCategoriesParent._id
                  }')">${setTitleMainCategories(
                subSubCategoriesParent.parent,
                categoriesArray
              )}</p>
                </div>
                <div class="sidebar__category-link_details">
                  
                  <p class="me-3" onclick=categoryClickHandler('${
                    subSubCategoriesParent._id
                  }')>| ${subSubCategoriesParent.title}</p>
                </div>
                <ul class="subCategory-list">
                  ${subSubCategoriesParent.subCategories
                    .map(createSubCategoryHtml)
                    .join("")}
                </ul>
              </div>
            
            
            `
            );
          }
        } else {
          // *step2
          categoriesInfos.forEach((category) => {
            categoriesContainer?.insertAdjacentHTML(
              "beforeend",
              `
            
             <div class="all-categories">
                <p onclick="backToAllCategories()">همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link active-category" href="#">
                <div class="sidebar__category-link_details">
                  <i class="sidebar__category-icon bi ${setIconForCategory(
                    category
                  )}""></i>
                  <p>${category.title}</p>
                </div>
                <ul class="subCategory-list">
                  ${category.subCategories.map(createSubCategoryHtml).join("")}
                </ul>
              </div>
            
            
            `
            );
          });
        }
      } else {
        // *step1
        categoriesArray.forEach((category) => {
          categoriesContainer?.insertAdjacentHTML(
            "beforeend",
            `
            <div class="sidebar__category-link" id="category-${category._id}">
<div class="sidebar__category-link_details" onclick="categoryClickHandler('${
              category._id
            }')">
    <i class="sidebar__category-icon bi ${setIconForCategory(category)}"></i>
    <p>${category.title}</p>
</div>
</div>
          `
          );
        });
      }
    });

  const createSubCategoryHtml = (subCategory) => {
    return `<li onclick="categoryClickHandler('${subCategory._id}')" class="${
      categoryIdParams == subCategory._id ? "active-subCategory" : ""
    }">| ${subCategory.title}</li>`;
  };

  // **subcategory

  const findSubCategoryById = (subCategoriesList, subCategoriesID) => {
    const allSubCategories = subCategoriesList.flatMap(
      (categories) => categories.subCategories
    );
    const sub = allSubCategories.find(
      (subCategories) => subCategories._id === subCategoriesID
    );
    return sub;
  };

  // ?subsubcategory
  const findSubSubCategoryById = (subCategoriesList, subCategoriesID) => {
    const allSubCategories = subCategoriesList.flatMap(
      (categories) => categories.subCategories
    );
    const allSubSubCategories = allSubCategories.flatMap(
      (categories) => categories.subCategories
    );

    const subSub = allSubSubCategories.find(
      (subSubCategories) => subSubCategories._id === subCategoriesID
    );
    return subSub;
  };

  const setTitleMainCategories = (parentID, mainCategories) => {
    const found = mainCategories.find((category) => category._id === parentID);
    return found ? found.title : null;
  };

  const filterGenerator = (filter) => {
    const sidebarFilters = document.querySelector("#sidebar-filters");

    sidebarFilters?.insertAdjacentHTML(
      "beforebegin",
      `
        ${
          filter.type == "selectbox"
            ? `
        
                          <div class="accordion accordion-flush" id="accordionFlushExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-${filter.slug}"
                        aria-expanded="false"
                        aria-controls="accordion-${filter.name}"
                      >
                        <span class="sidebar__filter-title">${
                          filter.name
                        }</span>
                      </button>
                    </h2>
                    <div
                      id="accordion-${filter.slug}"
                      class="accordion-collapse collapse"
                      aria-labelledby="accordion-${filter.name}"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <select class="selectbox" onclick=selectBoxFilterHandler(event.target.value,'${filter.slug}')>
                          <option disabled selected>انتخاب کنید</option>
                          ${filter.options
                            .sort()
                            .map(
                              (option) =>
                                `<option value='${option}'>${option}</option>`
                            )
                            .join("")}
                                                 
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
        
        `
            : ""
        }
          
        
        ${
          filter.type == "checkbox"
            ? `
        <div class="sidebar__filter">
            <label class="switch">
                <input id="exchange_controll" class="icon-controll" type="checkbox">
                <span class="slider round"></span>
            </label>
            <p>${filter.name}</p>
         </div>
        `
            : ""
        }
        
        `
    );
  };

  // ??handle filter checkBox

  const justPhotoControll = document.querySelector("#just_photo_controll");
  const exchangeControll = document.querySelector("#exchange_controll");

  justPhotoControll?.addEventListener("change", (event) => {
    if (justPhotoControll.checked) {
      let filteredPost = posts.filter((havePhoto) => havePhoto.pics.length);
      generatePosts(filteredPost);
    } else {
      generatePosts(backupPosts);
    }
  });
  exchangeControll?.addEventListener("change", (event) => {
    if (exchangeControll.checked) {
      let filteredPost = posts.filter((havePhoto) => havePhoto.exchange);
      generatePosts(filteredPost);
    } else {
      generatePosts(backupPosts);
    }
  });

  // **handle min & max price

  const minPrice = document.querySelector("#min-price-selectbox");
  const maxPrice = document.querySelector("#max-price-selectbox");

  const applyFilters = () => {
    let minPriceValue = minPrice.value;
    let maxPriceValue = maxPrice.value;
    let filteredPost = backupPosts;

    // **filter 
 for (const slug in dynamicFilter) {
            const element = dynamicFilter[slug];
            
         filteredPost = filteredPost.filter(post=>{
            post.dynamicFields.some(fields=>fields.slug==slug && fields.data==element)
          })                          
          
    }



// !!price Filter

    if (maxPriceValue !== "default") {
      if (minPriceValue !== "default") {
        filteredPost = posts.filter(
          (post) => post.price >= minPriceValue && post.price <= maxPriceValue
        );
      } else {
        filteredPost = posts.filter((post) => post.price <= maxPriceValue);
      }
    } else {
      if (minPriceValue !== "default") {
        filteredPost = posts.filter((post) => post.price >= minPriceValue);
        console.log(filteredPost);
        
      }
    }

// !!


    generatePosts(filteredPost)
  };

  minPrice?.addEventListener("change", () => {
    applyFilters();
  });

  maxPrice?.addEventListener("change", () => {
    applyFilters();
  });

  window.selectBoxFilterHandler=(value,slug)=>{
        dynamicFilter[slug]=value
        applyFilters()
  }
  
});

  // !!Icon
 const setIconForCategory = (category) => {
    const iconMap = {
      "کالای دیجیتال": "bi-phone", // یا "bi-phone" اگر گوشی مد نظره
      "وسایل نقلیه": "bi-car-front",
      "وسایل شخصی": "bi-briefcase",
    };

    const title = category.title.trim();
    const iconClass = iconMap[title] || "bi-folder";

    return iconClass;
  };
export{setIconForCategory}