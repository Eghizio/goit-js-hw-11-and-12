import"./assets/styles-DD3qoKza.js";const x="46463630-3c03a0f5bb3e2a02ee15ce5e1",l=new SimpleLightbox(".gallery a#lightbox-link"),n={searchQuery:null,page:1,photos:[],reset(){this.searchQuery=null,this.page=1,this.photos=[]}},p=(e,t)=>Object.assign(document.createElement(e),t),o={element:document.querySelector(".gallery"),clear(){this.element.replaceChildren()},render(e){this.element.append(...Array.isArray(e)?e:[e])},LoadMoreButton:{element:p("button",{className:"btn",textContent:"Load more",async onclick(){const e=y.create();this.after(e),o.LoadMoreButton.hide();try{const t=await u.getPhotos(n.searchQuery,n.page+1);n.page++;const r=t.hits.map(g).map(S).map(f);n.photos.push(...r),e.remove(),o.render(n.photos),o.LoadMoreButton.show()}catch{d.error("Sorry, couldn't load images. Please try again later!")}finally{l.refresh()}}}),show(){o.element.after(this.element)},hide(){this.element.remove()}}},d={error(e){iziToast.error({message:e,position:"topRight"})}},u={async getPhotos(e,t=1){const r=new URLSearchParams({key:x,q:e,image_type:"photo",orientation:"horizontal",safesearch:!0,page:t,per_page:40});return(await axios.get("https://pixabay.com/api/",{params:r})).data}},y={create(){return p("div",{className:"loader"})}};document.querySelector("form#image-search").addEventListener("submit",async e=>{e.preventDefault();const t=e.target,r=t.elements.query.value;t.reset(),o.LoadMoreButton.hide(),o.clear(),o.render(y.create()),n.reset();try{const a=await u.getPhotos(r);if(n.searchQuery=r,a.hits.length===0){d.error("Sorry, there are no images matching your search query. Please try again!"),o.clear();return}const c=a.hits.map(g).map(S).map(f);n.photos.push(...c),o.clear(),o.render(c),o.LoadMoreButton.show()}catch{d.error("Sorry, couldn't load images. Please try again later!"),o.clear()}finally{l.refresh()}});const g=({webformatURL:e,largeImageURL:t,tags:r,likes:a,views:c,comments:i,downloads:h})=>({webformatURL:e,largeImageURL:t,tags:r,likes:a,views:c,comments:i,downloads:h}),S=({webformatURL:e,largeImageURL:t,tags:r,likes:a,views:c,comments:i,downloads:h})=>{const L=document.querySelector("template#card-template"),s=document.importNode(L.content,!0),b=s.querySelector("a#lightbox-link");b.href=t;const m=s.querySelector("img.card-img");return m.src=e,m.alt=r,m.title=r,s.querySelector('span.card-stats-item-count[data-item="likes"]').textContent=a,s.querySelector('span.card-stats-item-count[data-item="views"]').textContent=c,s.querySelector('span.card-stats-item-count[data-item="comments"]').textContent=i,s.querySelector('span.card-stats-item-count[data-item="downloads"]').textContent=h,s},f=e=>(e.querySelector("a#lightbox-link").addEventListener("click",t=>{t.preventDefault();const r=a=>{a.key==="Escape"&&(document.removeEventListener("keydown",r),l.close())};document.addEventListener("keydown",r),l.open(t.currentTarget)}),e);
//# sourceMappingURL=hw-12.js.map
