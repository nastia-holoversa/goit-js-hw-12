import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let currentQuery = "";
let currentPage = 1;
const PER_PAGE = 15;

form.addEventListener("submit", onSearch);

loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const query = e.currentTarget.elements["search-text"].value.trim();

  if (!query) {
    iziToast.warning({
      title: "Attention",
      message: "Enter a search word!",
      position: "topRight",
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      iziToast.info({
        title: "Nothing found",
        message:
          "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);

    const totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: "End of results",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "An error occurred while retrieving data.",
      position: "topRight",
    });
  } finally {
    hideLoader();
    form.reset();
  }
}

async function onLoadMore() {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits && data.hits.length > 0) {
      createGallery(data.hits);
      const firstGalleryItem = document.querySelector(".gallery .gallery-item");
      if (firstGalleryItem) {
        const { height: cardHeight } = firstGalleryItem.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: "smooth",
        });
      }
    }

    const totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        title: "End of results",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Could not load more images.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
}
