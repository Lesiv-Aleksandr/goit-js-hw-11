
import "./sass/main.scss";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getPixabay from './moduleJS/fetchPixabay.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { option } from './moduleJS/fetchPixabay.js';

const inpuSearchForm = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const btnSearch = document.querySelector('.search__button');
const inputValue = document.querySelector("[type='text']");
const loadBtn = document.querySelector('.load-button');
const header = document.querySelector(".header");
const main = document.querySelector(".main");

    let modalGallery = null;
    main.style.paddingTop = `${header.clientHeight + 20}px`;

    
    
    inpuSearchForm.addEventListener("submit", onGetImages);
    
    async function onGetImages(e) {
      e.preventDefault();
      btnSearch.setAttribute("disabled", true);
        try {
          option.userQuery = inputValue.value;
          option.pageNumber = 1;
    
            if (option.userQuery === "") {
              Notify.info("Please, fill in the input field");
              return;
            }
    
                  const { hits, totalHits } = await getPixabay();
                  galleryRef.innerHTML = "";
              
                      if (hits.length === 0) {
                        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                        return;
                      }
    
        additionGallery(hits);
              Notify.success(`Hooray! We found ${totalHits} images.`);
                  loadBtn.classList.remove("is-hidden");
                    const perPage = 40;
                    modalGallery = modalShow(".gallery a");

                        if (totalHits / perPage < option.pageNumber) {
                          loadBtn.classList.add("is-hidden");
                          return Notify.info("We're sorry, but you've reached the end of search results.");
                        }
    
                  option.pageNumber += 1;
                } catch (error) {
                  console.log(error);
                } finally {
                  btnSearch.removeAttribute("disabled");
                }
          }
    
    function additionGallery(hits) {
      galleryRef.insertAdjacentHTML("beforeend", galleryMarkupTamplate(hits));
    }
    
    function galleryMarkupTamplate(hits) {
      return hits.map(Properties).join("");
    }
    
    function Properties({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) {
      return `
      <li class="gallery__item">
      <div class="gallery__card">
      <a class="gallery__link" href='${largeImageURL}'>
      <div class="gallery__photo-thumb">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" decoding="async"/>
      </div>
      </a>
      <ul class="gallery__info">
        <li class="gallery__info-item">
          <b>Likes</b> <span>${likes}</span>
        </li>
        <li class="gallery__info-item">
          <b>Views</b> <span>${views}</span>
        </li>
        <li class="gallery__info-item">
          <b>Comments</b> <span>${comments}</span>
        </li>
        <li class="gallery__info-item">
          <b>Downloads</b> <span>${downloads}</span>
        </li>
      </ul>
      </div>
    </li>`;
    }
    
    loadBtn.addEventListener("click", onLoadMoreImages);
  
    async function onLoadMoreImages(event) {
      loadBtn.classList.add("is-hidden");
      const { hits, totalHits } = await getPixabay();
      additionGallery(hits);
      modalGallery.refresh();
      smoothScroll();
      const perPage = 40;
      if (totalHits / perPage < option.pageNumber) {
        loadBtn.classList.add("is-hidden");
        return Notify.info("We're sorry, but you've reached the end of search results.");
      }
      loadBtn.classList.remove("is-hidden");
      option.pageNumber += 1;
    }
    
    galleryRef.addEventListener("click", onImageClick);
    function onImageClick(event) {
      event.preventDefault();
    }
    
    function smoothScroll() {
      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }
    
    function modalShow(selector) {
      const modalGallery = selector;
      const modalOptions = {
        captionsData: "alt",
        animationSpeed: 180,
        fadeSpeed: 250,
      };
    
      return new SimpleLightbox(modalGallery, modalOptions);
    }