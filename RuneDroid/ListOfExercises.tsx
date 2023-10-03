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
import { useSolvedExercises } from './SolvedExercisesHook';
import { GetCountryFlag } from './Utils';

type ListOfExercisesPropsType = {
  exercises: Array<ExerciseType>,
  setExercise: ((exercise: ExerciseType) => void),
  columns: number
};

// TODO: display thumbnails instead, for better performance?
function ListOfExercises(props: ListOfExercisesPropsType): JSX.Element {
  const [isExerciseSolved, _] = useSolvedExercises();

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
    if (props.columns == 1) {
      return Math.min(Math.max(5/4, aspectRatio), 3/2);
    } 
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
                              colors={
                                  ["#fffd", "#fff3", "#fff1", "#fff1"]
                              }
                              style={styles.linGrad}
                            >
                              {/* {
                                isExerciseSolved(exercise.id) &&
                                <Text
                                  style={styles.doneMarker}>
                                    ✅
                                </Text>
                              } */}
                              <Text
                                style={styles.title}>
                                {
                                  (isExerciseSolved(exercise.id) ? "✅ " : "")
                                  + (exercise.country !== undefined ? 
                                    GetCountryFlag(exercise.country) + " "
                                    : "")
                                  + exercise.title
                                }
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
    fontFamily: "Forum-Regular",
    color: "#000",
    zIndex: 3,
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 15,
    fontFamily: "Aboreto-Regular",
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
    fontSize: 18,
    color: "#000",
    zIndex: 3,
    fontFamily: "Finlandica-Regular",
    marginLeft: 2,
  },
  linGrad: {
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  container: {
    width: "auto",
    marginTop: 5,
    marginHorizontal: 2,
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
    alignItems: 'flex-start'
  },
  doneMarker: {
    alignSelf: 'flex-end',
    fontSize: 20,
    zIndex: 3,
  }
});


export { ListOfExercises };