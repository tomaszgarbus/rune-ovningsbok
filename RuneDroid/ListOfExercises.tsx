import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { CanonicalRuneRowMap, ExerciseType }  from './Types';
import { StaticThumbnails } from './StaticImages.autogen';
import { useSolvedExercises } from './SolvedExercisesHook';
import { GetCountryFlag } from './Utils';

type ListOfExercisesPropsType = {
  exercises: Array<ExerciseType>,
  setExercise: ((exercise: ExerciseType) => void),
  columns: number,
  runeRows: CanonicalRuneRowMap,
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
                          style={styles.container}>
                          <View style={{
                            width: "70%",
                            height: "100%"
                          }}>
                            <Text
                              numberOfLines={1}
                              style={styles.title}>
                              {
                                (isExerciseSolved(exercise.id) ? "✅ " : "")
                                + (exercise.country !== undefined ? 
                                  GetCountryFlag(exercise.country) + " "
                                  : "")
                                + exercise.title
                              }
                            </Text>
                            <View
                              style={styles.infoBox}>
                              <Text
                                numberOfLines={1}
                                style={styles.infoLine}>
                                {props.runeRows[exercise.rowType].name}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={styles.infoLine}>
                                Length: {exercise.runes.length}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={styles.infoLine}>
                                {exercise.runes}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.imageParent}>
                            <Image
                              source={StaticThumbnails[exercise.id]}
                              style={styles.image}
                              />
                          </View>
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
    width: "auto",
    height: undefined,
    resizeMode: 'cover',
    aspectRatio: 1,
    margin: 2,
  },
  title: {
    fontSize: 18,
    color: "#ddd",
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
    flex: 1,
    flexDirection: 'row',
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
    backgroundColor: '#222',
  },
  infoBox: {
    paddingHorizontal: 5,
  },
  infoLine: {
    fontFamily: "Finlandica-Regular",
    color: "white",
  },
  imageParent: {
    width: "30%",
    height: "100%"
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