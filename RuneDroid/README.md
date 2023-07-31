# RuneDroid

## Running the app locally.

See https://reactnative.dev/docs/environment-setup?guide=native for full instructions.

After the environment has been set up, run the following to start a debugging server connected to the Android Virtual Device:

```
npx react-native run-android
```

To see the logs, run:
```
npx react-native log-android
```

After adding a new exercises, remember to run the following command:
```
python3 ../py_utils/autogen_static_images.py
```
and paste the output to `StaticImages.autogen.tsx` (TODO: Add a GitHub Action as a reminder).