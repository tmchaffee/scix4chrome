var initq = {
  title: "",
  metatitle: "",
  metarefs: ""
}
const title = document.querySelector("title");
if(title) {
  initq.title = title.textContent;
}

const metatitle = document.querySelector('meta[name="citation_title"]');
if(metatitle.content) {
    initq.metatitle = metatitle.content
}
const metarefs = document.querySelector('meta[name="article_references"]');
if(metarefs.content){
  initq.metarefs = metarefs.content
}

console.log("metatitle:", initq.metatitle);
console.log("metarefs:", initq.metarefs);
console.log("aa");
console.log("title:", initq.title);
chrome.runtime.sendMessage({
  from: 'title',
  subject: 'documentInfo',
  titles: initq
});
