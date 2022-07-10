import refs from "./js/selectors.js";
import values from "./js/values.json" assert { type: "json" };
import RandomCat from "./js/randomCat.js"
import PixabayGallery from "./js/pixabaySearch.js"
import UnsplashGallery from "./js/unsplashSearch.js"


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



let searchRanomCat = new RandomCat(refs, values);
searchRanomCat.init();

let searchPixabayGallery = new PixabayGallery(values, refs);
searchPixabayGallery.init();

let searchUnsplashGallery = new UnsplashGallery(values, refs);


