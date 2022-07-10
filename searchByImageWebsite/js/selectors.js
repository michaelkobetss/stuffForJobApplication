export default {
  searchButton: document.querySelector("#search-button"), //search buttong <input>
  loadMoreButton: document.querySelector(".load-more"), //load more button <button>
  resultTemplatePixabay: document.querySelector(".result-template-pixabay")
    .innerHTML, //to draw result with handlebars <template>
  resultTemplateUnsplash: document.querySelector(".result-template-unsplash")
    .innerHTML, //to draw result with handlebars <template>
  gallery: document.querySelector(".gallery"), // gallery <ul> selector
  apiButton: document.querySelector("#api-selector-button"), // switch API button <select>
  randomCatButton: document.querySelector("#random-cat-button"), // <button> to generate 12 random cats
  randomCatTemplate: document.querySelector(".random-cat-template").innerHTML, // <button> to generate 12 random cats
};
