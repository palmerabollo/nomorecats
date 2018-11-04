# No more cats

A Chrome extension that blocks all those annoying cats online.

## Install

Clone the project:

```sh
git clone git@github.com:palmerabollo/nomorecats.git
cd nomorecats
```

In Google Chrome:
- Open **`chrome://extensions`**
- Enable the `"Developer Mode"` toggle.
- Click `"Load unpacked"` and open the "nomorecats" project you cloned before.

Once the plugin is loaded you'll see a new card. There is an **"Inspect views `background.html`"** link that lets you debug the `background.js` script containing all the tensorflow magic.

Every time you open a page with images, they will be processed and you'll see a log like the following one:

```
Readable prediction for https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&h=350
Float32Array(2) [0.43529072403907776, 0.5647093057632446]
````

The Float32Array contains two elements. The first one (`p`) is the probability to be a cat. The second one is `1-p`.

## Train a new model

The extension uses a MobileNet model trained with tensorflow and converted to tensorflowjs to be used in the extension.

### Install prerequisites

- jq
- tensorflow: `pip install --upgrade "tensorflow==1.7.*"`
- tensorflowjs: `pip install tensorflowjs`

### Train a new model:

```sh
git clone https://github.com/googlecodelabs/tensorflow-for-poets-2

cd tensorflow-for-poets

export IMAGE_SIZE=224
export ARCHITECTURE="mobilenet_0.50_$IMAGE_SIZE"

#
# copy the "dataset" folder in the repo to tf_files
#

# Train the model
python -m scripts.retrain \
  --bottleneck_dir=tf_files/bottlenecks \
  --how_many_training_steps=500 \
  --model_dir=tf_files/models/ \
  --summaries_dir=tf_files/training_summaries/"$ARCHITECTURE" \
  --output_graph=tf_files/retrained_graph.pb \
  --output_labels=tf_files/retrained_labels.txt \
  --architecture="$ARCHITECTURE" \
  --image_dir=tf_files/dataset

# Convert to tensorflowjs
tensorflowjs_converter \
  --input_format=tf_frozen_model \
  --output_node_names=final_result \
  tf_files/retrained_graph.pb \
  tf_files/web

#
# Quantize & optimize not mandatory.
# Skip them for now for simplicity.
#

# Generate labels.json from retrained_labels.txt
cat tf_files/retrained_labels.txt | jq -Rsc '. / "\n" - [""]' > tf_files/web/labels.json
```

Now copy everything under tf_files/web to the extension's `"tensorflow"` folder and reload the extension in Google Chrome.

## References

- https://codelabs.developers.google.com/codelabs/tensorflow-for-poets/
- https://index.pocketcluster.io/woudsma-retrain-mobilenet-for-the-web.html
- https://proandroiddev.com/re-training-the-model-with-images-using-tensorflow-7758e9eb8db5
- https://js.tensorflow.org/tutorials/import-saved-model.html

## License

Apache 2.0
