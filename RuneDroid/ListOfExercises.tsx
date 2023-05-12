import {
    FlatList,
    ScrollView,
    Text
} from 'react-native';
import Exercises from './Exercises.json';

function ListOfExercises(): JSX.Element {
    return (
        <ScrollView>
            <Text>text</Text>
            {
                Exercises.map(
                    exercise) => <Text>text</Text>
                );
            }
        </ScrollView>
    )
}

export default ListOfExercises;