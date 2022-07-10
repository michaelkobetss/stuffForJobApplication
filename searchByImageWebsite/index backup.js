import refs from "./js/selectors.js";
import values from "./js/values.json" assert { type: "json" };

let anonymousFunction1, anonymousFunction2;

class PixabayGallery {
  constructor(API_KEY, pageNumber = 1) {
    this.API_KEY = API_KEY;
    this.pageNumber = pageNumber;
  }

  init = () => {
    refs.searchButton.addEventListener(
      "input",
      (anonymousFunction1 = _.debounce(this.findImage, 1000))
    ); //listener on search <input>
    refs.loadMoreButton.addEventListener("click", this.findMoreImages); //listener on load more <button>
    refs.gallery.addEventListener("click", this.onGalleryClick); //listener on images to open modal window
  };

  exit = () => {
    refs.searchButton.removeEventListener("input", anonymousFunction1); //listener on search <input>
    refs.loadMoreButton.removeEventListener("click", this.findMoreImages); //listener on load more <button>
    refs.gallery.removeEventListener("click", this.onGalleryClick); //listener on images to open modal window\
  };

  findImage = () => {
    this.pageNumber = 1;
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawImages(images));
  };

  findMoreImages = () => {
    this.pageNumber += 1;
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawMoreImages(images.hits));
  };

  // Rendering page after api response
  drawImages = (listOfImages) => {
    refs.gallery.innerHTML = "";

    // to prevent searching of empty input after clearing input
    if (refs.searchButton.value == "") {
      refs.loadMoreButton.style.display = "none";
      return;
    }

    // Rendering a page
    if (listOfImages.total !== 0) {
      let templateScript = Handlebars.compile(refs.resultTemplatePixabay);
      let markup = templateScript(listOfImages.hits);
      refs.gallery.insertAdjacentHTML("beforeend", markup);
      refs.loadMoreButton.style.display = "";
      PNotify.alert({
        title: "Ready",
        text: `${listOfImages.total} results found!`,
        hide: true,
        delay: 2000,
      });
    }

    //To show error message when nothing was found
    if (listOfImages.total === 0) {
      refs.loadMoreButton.style.display = "none";
      PNotify.error({
        title: "Error",
        text: `Nothing was found!`,
        hide: true,
        delay: 2000,
      });
      return;
    }
  };

  // Handlebars rendering images after using "load more" button
  drawMoreImages = (listOfImages) => {
    console.log(listOfImages);
    let templateScript = Handlebars.compile(refs.resultTemplatePixabay);
    let markup = templateScript(listOfImages);
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    console.log(refs.loadMoreButton);
  };

  // Basic lightbox to display modal images
  displayModal = (src) => {
    const instance = basicLightbox.create(`
      <div class="modal">
      <img class="gallery-item-modal" src="${src}" alt=""
      />
      </div>
  `);
    instance.show();
  };

  //Bubbling event listener
  onGalleryClick = (event) => {
    if (event.target.nodeName !== "IMG") {
      return;
    }
    this.displayModal(event.target.dataset.hd);
  };
}

console.log(refs.randomCatTemplate);
class UnsplashGallery {
  constructor(API_KEY, pageNumber = 1) {
    this.API_KEY = API_KEY;
    this.pageNumber = pageNumber;
  }

  init = () => {
    refs.searchButton.addEventListener(
      "input",
      (anonymousFunction2 = _.debounce(this.findImage, 1000))
    ); //listener on search <input>
    refs.loadMoreButton.addEventListener("click", this.findMoreImages); //listener on load more <button>
    refs.gallery.addEventListener("click", this.onGalleryClick); //listener on images to open modal window
  };
  exit = () => {
    refs.searchButton.removeEventListener("input", anonymousFunction2); //listener on search <input>
    refs.loadMoreButton.removeEventListener("click", this.findMoreImages); //listener on load more <button>
    refs.gallery.removeEventListener("click", this.onGalleryClick); //listener on images to open modal window
  };

  findImage = () => {
    this.pageNumber = 1;
    fetch(
      `https://api.unsplash.com/search/photos/?query=${refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawImages(images));
  };

  findMoreImages = () => {
    this.pageNumber += 1;
    fetch(
      `https://api.unsplash.com/search/photos/?query=${refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawMoreImages(images.results));
    console.log(refs.loadMoreButton);
  };

  // Rendering page after api response
  drawImages = (listOfImages) => {
    refs.gallery.innerHTML = "";

    // to prevent searching of empty input after clearing input
    if (refs.searchButton.value == "") {
      refs.loadMoreButton.style.display = "none";
      return;
    }

    // Rendering a page
    if (listOfImages.total !== 0) {
      let templateScript = Handlebars.compile(refs.resultTemplateUnsplash);
      let markup = templateScript(listOfImages.results);
      refs.gallery.insertAdjacentHTML("beforeend", markup);
      refs.loadMoreButton.style.display = "";
      PNotify.alert({
        title: "Ready",
        text: `${listOfImages.total} results found!`,
        hide: true,
        delay: 2000,
      });
    }

    //To show error message when nothing was found
    if (listOfImages.total === 0) {
      refs.loadMoreButton.style.display = "none";
      PNotify.error({
        title: "Error",
        text: `Nothing was found!`,
        hide: true,
        delay: 2000,
      });
      return;
    }
  };

  // Handlebars rendering images after using "load more" button
  drawMoreImages = (listOfImages) => {
    let templateScript = Handlebars.compile(refs.resultTemplateUnsplash);
    let markup = templateScript(listOfImages);
    refs.gallery.insertAdjacentHTML("beforeend", markup);
  };

  // Basic lightbox to display modal images
  displayModal = (src) => {
    const instance = basicLightbox.create(`
      <div class="modal">
      <img class="gallery-item-modal" src="${src}" alt=""/>
      </div>
  `);
    instance.show();
  };

  //Bubbling event listener
  onGalleryClick = (event) => {
    if (event.target.nodeName !== "IMG") {
      return;
    }
    this.displayModal(event.target.dataset.hd);
  };
}
class RandomCat {
  init = () => {
    refs.randomCatButton.addEventListener("click", this.getCat);
  };

  getCat = () => {
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=cat&per_page=3&page=${Math.floor(
        Math.random() * 150
      )}${values.PIXABAY_API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawCat(images.hits));
  };

  drawCat = (cat)=>{
    console.log(Math.floor(
      Math.random() * 3
    ));
    refs.gallery.innerHTML = "";

    let templateScript = Handlebars.compile(refs.randomCatTemplate);
    let markup = templateScript(cat);
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    refs.loadMoreButton.style.display = "none";
    PNotify.alert({
      title: "Ready",
      text: `Here is your cat!`,
      hide: true,
      delay: 500,
    });}

}

let searchRanomCat = new RandomCat();
searchRanomCat.init();

let searchPixabayGallery = new PixabayGallery(values.PIXABAY_API_KEY);
searchPixabayGallery.init();

let searchUnsplashGallery = new UnsplashGallery(values.UNSPLASH_API_KEY);
// searchUnsplashGallery.init()

refs.apiButton.addEventListener("input", (e) => {
  if (e.target.value === "Pixabay") {
    searchPixabayGallery.init();
    searchUnsplashGallery.exit();
    console.log("Pixabay is active");
  } else {
    searchUnsplashGallery.init();
    searchPixabayGallery.exit();
    console.log("Unsplash is active");
  }
});
