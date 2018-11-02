# tensorflow

This folder contains the trained tensorflow model, converted to tensorflowjs:

```sh
tensorflowjs_converter \
  --input_format=tf_frozen_model \
  --output_node_names=final_result \
  tf_files/retrained_graph.pb \
  tf_files/web
```

The file `labels.json` was generated from retrained_labels.txt:

```sh
cat tf_files/retrained_labels.txt | jq -Rsc '. / "\n" - [""]' > tf_files/web/labels.json
```

References:
- https://index.pocketcluster.io/woudsma-retrain-mobilenet-for-the-web.html
- https://proandroiddev.com/re-training-the-model-with-images-using-tensorflow-7758e9eb8db5
- https://js.tensorflow.org/tutorials/import-saved-model.html
- https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2/