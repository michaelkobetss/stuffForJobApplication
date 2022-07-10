export default class RandomCat {
    constructor(refs, values){
        this.values = values
        this.refs = refs
    }
    init = () => {
        this.refs.randomCatButton.addEventListener("click", this.getCat);
    };
  
    getCat = () => {
      fetch(
        `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=cat&per_page=5&page=${Math.floor(
          Math.random() * 100 +1
        )}${this.values.PIXABAY_API_KEY}`
      )
        .then((data) => data.json())
        .then((images) => this.drawCat(images.hits));
    };
  
    drawCat = (cat)=>{
     
      this.refs.gallery.innerHTML = "";
  
      let templateScript = Handlebars.compile(this.refs.randomCatTemplate);
      let markup = templateScript(cat);
      this.refs.gallery.insertAdjacentHTML("beforeend", markup);
      this.refs.loadMoreButton.style.display = "none";
      }
  
  }