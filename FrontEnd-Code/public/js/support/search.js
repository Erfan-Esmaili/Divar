import { baseUrl } from "../../../utils/shared.js";
import { getParamFromUrl } from "../../../utils/utils.js";

window.addEventListener("load", async() => {
  let loading = document.querySelector("#loading-container");
  loading.style.display='none'

    const key= getParamFromUrl('key')
  const breadcrumbSpan = document.querySelector('#breadcrumb span')
  const searchTitle = document.querySelector('.search-title span')
  const searchResults = document.querySelector('#search-results')

searchTitle.innerHTML=`«${key}»`
breadcrumbSpan.innerHTML=key


const res= await fetch(`${baseUrl}/v1/support/articles/search?s=${key}`)
const response =await res.json()
  if(response.data.articles.length){

    response.data.articles.forEach(search=> {
      searchResults.insertAdjacentHTML('beforeend',`
        
        <a href="./article.html?id=${search._id}">
          <div>
          <p>${search.title}</p>
                    </div>
        <i class="bi bi-chevron-left"></i>
        
        </a>
        
        
        `)
      });
    }else{
     searchResults.insertAdjacentHTML('beforeend',`
        <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" />
        <p>نتیجه‌ای برای جستجوی شما یافت نشد</p>
        <span>پیشنهاد می‌کنیم:</span>
        <span>نگارش کلمات خود را بررسی نمایید.</span>
        <span>کلمات کلیدی دیگری را انتخاب کنید.</span>
      
      
      `)
    }
})