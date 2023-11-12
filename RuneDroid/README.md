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

## Development

### Adding tooltips

To add tooltips to a component:

1. Import the custom hook: `import Tooltip from 'react-native-walkthrough-tooltip';`
2. Set the state in the component: `const [currentToolTip, nextToolTip] = useToolTips(${COMPONENT_NAME}, $N);`, where $N means how many tooltips there will be.
3. Wrap the nodes with `<Tooltip isVisible={currentToolTip == $M}`, where `0<$M<$N` means which tooltip in order that is.

## Release

Update `versionCode` and `versionName` in `build.gradle`. Then:

```
$ npx react-native build-android --mode=release
$ cd android
$ ./gradlew bundleRelease
$ cd ..
$ ls -lh android/app/build/outputs/bundle
```