const IMAGE_SIZE = 224;
const CAT_THRESHOLD = 0.85;

const MODEL_URL = chrome.extension.getURL('tensorflow/tensorflowjs_model.pb');
const WEIGHTS_URL = chrome.extension.getURL('tensorflow/weights_manifest.json');

tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL).then((model) => {
  async function loadImage(url) {
    const image = new Image(IMAGE_SIZE, IMAGE_SIZE);
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = url;
    });
  }

  async function executeModel(url) {
    const resource = await loadImage(url);
    const image = tf.fromPixels(resource);

    let tensor = tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    tensor[0] = image;

    const prediction = model.predict({ Placeholder: tensor }) // MobileNet V2
    // const prediction = model.predict(tensor); // MobileNet V1

    const output = prediction.dataSync(); // [cat_probability, nocat_probability]
    console.log('Readable prediction for %s', url, output);

    return output;
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    return executeModel(request.url)
      .then(result => sendResponse({result: result[0] > CAT_THRESHOLD}))
      .catch(err => sendResponse({result: false}));
  });
});
