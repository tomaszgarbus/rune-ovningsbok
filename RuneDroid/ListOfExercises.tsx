import {
    FlatList,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Exercises from './Exercises.json';
import StaticImages from './StaticImages.autogen';
import LinearGradient from 'react-native-linear-gradient';


// TODO: display thumbnails instead, for better performance?
function ListOfExercises(): JSX.Element {
  return (
    <ScrollView>
      <Text>text</Text>
      {
        Exercises.map(
          exercise => (
            StaticImages[exercise.id] ?
            <View
            key={exercise.id}
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
            :
            <></>
          )
        )
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
    // height: 200,
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
  // title: {
  //   marginTop: 16,
  //   paddingVertical: 8,
  //   borderWidth: 4,
  //   borderColor: '#20232a',
  //   borderRadius: 6,
  //   backgroundColor: '#61dafb',
  //   color: '#20232a',
  //   textAlign: 'center',
  //   fontSize: 30,
  //   fontWeight: 'bold',
  // },
});


export default ListOfExercises;