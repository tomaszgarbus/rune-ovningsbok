import {
  Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ExerciseType }  from './Types';
import { StaticThumbnails } from './StaticImages.autogen';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';

type ListOfExercisesPropsType = {
  exercises: Array<ExerciseType>,
  setExercise: ((exercise: ExerciseType) => void),
  columns: number
};

// TODO: display thumbnails instead, for better performance?
function ListOfExercises(props: ListOfExercisesPropsType): JSX.Element {
  var exerciseColumns: Array<Array<ExerciseType>> = Array.from(
    Array(props.columns).keys()).map(
      (column_nr: Number): Array<ExerciseType> => {
        return props.exercises.filter(
          (_, index, __) => {
            return index % props.columns === column_nr;
          }
        )
      }
  );

  function boundedAspectRatio(aspectRatio: number) {
    return Math.min(Math.max(2/3, aspectRatio), 4/5);
  }

  type ImageAspectRatiosDictType = { [exercise_id: string]: (number) };
  const [imageAspectRatios, setImageAspectRatios] = useState<ImageAspectRatiosDictType>(
    props.exercises.reduce(
      (dict: ImageAspectRatiosDictType, exercise: ExerciseType, idx: number, array: any) => {
        const source = Image.resolveAssetSource(StaticThumbnails[exercise.id]);
        dict[exercise.id] = boundedAspectRatio(source.width / source.height);
        return dict;
      },
      {}
  ));

  return (
    <ScrollView>
      <Text style={styles.header}>Welcome to RuneDroid</Text>
      <Text style={styles.subheader}>Pick an exercise to get started</Text>
      <View style={styles.columnsContainer}>
        {
          exerciseColumns.map(
            (column: Array<ExerciseType>, column_index: number) => (
              <View
                key={column_index}
                style={{width: `${100 / props.columns}%`}}>
                {
                  column.map(
                    (exercise: ExerciseType) => (
                      StaticThumbnails[exercise.id] ?
                      <TouchableOpacity
                        key={exercise.id}
                        onPress={(_) => props.setExercise(exercise)}>
                        <View
                          style={
                            [
                              {
                                aspectRatio: imageAspectRatios[exercise.id]
                              },
                              styles.container,
                            ]
                          }>
                          <ImageBackground
                            source={StaticThumbnails[exercise.id]}
                            style={styles.image}
                            onLoad={
                              ({nativeEvent: {source: {width, height}}}) => setImageAspectRatios(
                                {
                                  ...imageAspectRatios,
                                  [exercise.id]: boundedAspectRatio(width / height)
                                }
                              )
                            }
                            >
                            <LinearGradient
                              colors={["#fffd", "#fff3", "#fff0", "#fff0"]}
                              style={styles.linGrad}
                            >
                              <Text
                                style={styles.title}>
                                {exercise.title}
                              </Text>
                            </LinearGradient>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                      :
                      <></>
                    )
                  )
                }
              </View>
            )
          )
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    zIndex: 3,
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    zIndex: 3,
    textAlign: "center",
    margin: 10,
  },
  image: {
    width: "100%",
    height: "100%"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    zIndex: 3,
    // textShadowColor: "#fff",
    // textShadowRadius: 2,
    // textShadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
  },
  linGrad: {
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  container: {
    width: "auto",
    marginTop: 5,
    marginHorizontal: 5,
    // minHeight: 100,
    // maxHeight: 300,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    elevation: 3,
    // Needed for elevation to work:
    backgroundColor: '#fff',
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  }
});


export { ListOfExercises };