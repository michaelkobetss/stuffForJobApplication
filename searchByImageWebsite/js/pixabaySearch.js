export default class PixabayGallery {
  constructor(values, refs, ) {
    this.values = values;
    this.refs = refs;
    
    this.pageNumber = 1;
    this.anonymousFunction = _.debounce(this.findImage, 1000);
    this.observerOptions = { rootMargin: "-600px 0px 0px 0px" };
  }

  init = () => {
    this.refs.searchButton.addEventListener("input", this.anonymousFunction); //listener on search <input>
    this.refs.loadMoreButton.addEventListener("click", this.findMoreImages); //listener on load more <button>
    this.refs.gallery.addEventListener("click", this.onGalleryClick); //listener on images to open modal window
  };

  exit = () => {
    this.refs.searchButton.removeEventListener("input", this.anonymousFunction); //listener on search <input>
    this.refs.loadMoreButton.removeEventListener("click", this.findMoreImages); //listener on load more <button>
    this.refs.gallery.removeEventListener("click", this.onGalleryClick); //listener on images to open modal window\
  };

  findImage = () => {
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.values.PIXABAY_API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawImages(images))
      .catch((err) => console.error(err));
  };

  findMoreImages = () => {
    this.pageNumber += 1;
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.values.PIXABAY_API_KEY}`
    )
      .then((data) => data.json())
      .then((images) => this.drawMoreImages(images.hits))
      .catch((err) => console.error(err));
  };

  // Rendering page after api response
  drawImages = (listOfImages) => {
    this.refs.gallery.innerHTML = "";

    // to prevent searching of empty input after clearing input
    if (this.refs.searchButton.value == "") {
      this.refs.loadMoreButton.style.display = "none";
      return;
    }

    // Rendering a page
    if (listOfImages.total !== 0) {
      let templateScript = Handlebars.compile(this.refs.resultTemplatePixabay);
      let markup = templateScript(listOfImages.hits);
      this.refs.gallery.insertAdjacentHTML("beforeend", markup);
      this.refs.loadMoreButton.style.display = "";
      PNotify.alert({
        title: "Ready",
        text: `${listOfImages.total} results found!`,
        hide: true,
        delay: 2000,
      });
      this.intersectionObserverIMG();
      this.intersectionObserverLoadMore();
    }

    //To show error message when nothing was found
    if (listOfImages.total === 0) {
      this.refs.loadMoreButton.style.display = "none";
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
    let templateScript = Handlebars.compile(this.refs.resultTemplatePixabay);
    let markup = templateScript(listOfImages);
    this.refs.gallery.insertAdjacentHTML("beforeend", markup);
    this.intersectionObserverIMG();
    this.intersectionObserverLoadMore();
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

  //intersectionObserver
  intersectionObserverIMG = () => {
    if (!!window.IntersectionObserver) {
      let observer = new IntersectionObserver(
        this.onObserveIMG,
        this.observerOptions
      );
      document.querySelectorAll("img").forEach((img) => {
        observer.observe(img);
      });
    } else {
      alert("IntersectionObserver is not supported");
    }
  };

  onObserveIMG = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
      } else {
        entry.target.src = "";
      }
    });
  };

  intersectionObserverLoadMore = () => {
    if (!!window.IntersectionObserver) {
      let observer = new IntersectionObserver(
        this.onObserveLoadMore,
        this.observerOptions
      );
      observer.observe(this.refs.loadMoreButton);
    } else {
      alert("IntersectionObserver is not supported");
    }
  };
  onObserveLoadMore = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.findMoreImages();
        observer.unobserve(entry.target);
      }
    });
  };
}
