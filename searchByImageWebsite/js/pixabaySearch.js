export default class PixabayGallery {
    constructor(values, refs, pageNumber = 1, ) {
      this.values = values;
      this.refs = refs;
      this.pageNumber = pageNumber;
      this.anonymousFunction = _.debounce(this.findImage, 1000)
    }
  
    init = () => {
      this.refs.searchButton.addEventListener(
        "input",
        (this.anonymousFunction )
      ); //listener on search <input>
      this.refs.loadMoreButton.addEventListener("click", this.findMoreImages); //listener on load more <button>
      this.refs.gallery.addEventListener("click", this.onGalleryClick); //listener on images to open modal window
    };
  
    exit = () => {
        this.refs.searchButton.removeEventListener("input", this.anonymousFunction); //listener on search <input>
        this.refs.loadMoreButton.removeEventListener("click", this.findMoreImages); //listener on load more <button>
        this.refs.gallery.removeEventListener("click", this.onGalleryClick); //listener on images to open modal window\
    };
  
    findImage = () => {
      this.pageNumber = 1;
      fetch(
        `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.values.PIXABAY_API_KEY}`
      )
        .then((data) => data.json())
        .then((images) => this.drawImages(images));
    };
  
    findMoreImages = () => {
      this.pageNumber += 1;
      fetch(
        `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.refs.searchButton.value}&page=${this.pageNumber}&per_page=15${this.values.PIXABAY_API_KEY}`
      )
        .then((data) => data.json())
        .then((images) => this.drawMoreImages(images.hits));
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
      console.log(listOfImages);
      let templateScript = Handlebars.compile(this.refs.resultTemplatePixabay);
      let markup = templateScript(listOfImages);
      this.refs.gallery.insertAdjacentHTML("beforeend", markup);
      console.log(this.refs.loadMoreButton);
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
