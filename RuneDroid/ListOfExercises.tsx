import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ExerciseType}  from './Types';
import StaticImages from './StaticImages.autogen';
import LinearGradient from 'react-native-linear-gradient';

type ListOfExercisesPropsType = {
  exercises: Array<ExerciseType>,
  setExercise: ((exercise: ExerciseType) => void),
};

// TODO: display thumbnails instead, for better performance?
function ListOfExercises(props: ListOfExercisesPropsType): JSX.Element {
  return (
    <ScrollView>
      <Text style={styles.header}>Welcome to RuneDroid</Text>
      <Text style={styles.subheader}>Pick an exercise to get started</Text>
      {
        props.exercises.map(
          (exercise: ExerciseType) => (
            StaticImages[exercise.id] ?
            <TouchableOpacity
              key={exercise.id}
              onPress={(_) => props.setExercise(exercise)}>
              <View
                style={styles.container}>
                <ImageBackground
                  source={StaticImages[exercise.id]}
                  style={styles.image}>
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
    minHeight: 100,
    maxHeight: 300,
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
  }
});


export { ListOfExercises };