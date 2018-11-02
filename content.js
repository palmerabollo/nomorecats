const images = [...document.getElementsByTagName('img')];

images
  .filter(processableImage)
  .forEach(image => {
    chrome.runtime.sendMessage({url: image.src}, (response) => {
      if (response && response.result) {
        const imgURL = chrome.extension.getURL("images/placeholder-image.png");
        image.src = imgURL;
      }
    });
  });

function processableImage(image) {
  return image.width > 64 && image.height > 64;
}