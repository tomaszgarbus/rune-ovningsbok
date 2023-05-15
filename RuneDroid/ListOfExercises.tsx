import {
    FlatList,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import Exercises from './Exercises.json';

function ListOfExercises(): JSX.Element {
  return (
    <ScrollView>
      <Text>text</Text>
      {
        Exercises.map(
          exercise => (
            <ImageBackground
              source={require('images/' + exercise.img)}
              style={styles.image}>
              <Text
                key={exercise.id}
                style={styles.container}>
                {exercise.title}
              </Text>
            </ImageBackground>
          )
        )
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  image: {
    width: '100%',
    height: '100%',
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