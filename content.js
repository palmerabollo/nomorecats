const DEBUG = 1;
if (!DEBUG) console.log = () => {};

let isScrolling;
let images = [...document.getElementsByTagName('img')];

function clasifyImages() {
  [...images, ...document.getElementsByTagName('img')].unique().filter(validImage).forEach(analyzeImage);  
}

function validImage(image) {
  if(image.dataset.catReplaced){
    console.log("Already processed");
    return false;
  }  
  const valid = image.src &&
        image.width > 64 && image.height > 64 &&
        !image.dataset.catReplaced;
  console.log('image %s valid', image.src, valid);
  return valid;
}

function analyzeImage(image) {
  console.log('analyze image %s', image.src);

  chrome.runtime.sendMessage({url: image.src}, response => {
    console.log('prediction for image %s', image.src, response);
    console.log(image);
    if (response && response.result === true) {
      const replacedImageSrc = "https://source.unsplash.com/random/" + image.width + "x" + image.height;
      image.src = replacedImageSrc;
      image.srcset = "";
      image.dataset.cat = true;
      image.dataset.catReplaced = true;
    }
  });
}

document.addEventListener("scroll", (images)=>{ 
  clearTimeout(isScrolling);
  isScrolling = setTimeout(()=>{clasifyImages()}, 100);
});

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

clasifyImages();

// Some images can be dynamically loaded after the page is ready.
// We track those with a MutationObserver on the document body.
// There is a lot of room for improvement here. Contributions are welcome.

/**
const onmutation = (mutations) => {
  for (let mutation of mutations) {
    const images = [...mutation.addedNodes]
      .filter(node => node.nodeType === 1) // 1 = element
      .map(node => {
        if (node.tagName === 'IMG') {
          return [node];
        } else {
          const nodes = node.getElementsByTagName('img');
          if (nodes.length > 0) {
            return [...nodes];
          } else {
            return [];
          }
        }
      })
      .flat();

    console.log('Page contains %d new images', images.length);
    images.filter(validImage).forEach(analyzeImage);
  }
};

const observer = new MutationObserver(onmutation);
const config = { attributes: false, childList: true, subtree: true };
observer.observe(document.body, config);
*/
