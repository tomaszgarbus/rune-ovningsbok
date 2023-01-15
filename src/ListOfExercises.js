import ExercisesListItem from './ExercisesListItem';

function ListOfExercises(props) {
  return (
    <div>
      {
        props.items.map(
          exercise => <ExercisesListItem
            exercise={exercise}
            open={_ => props.setExercise(exercise)}
            />)
      }
    </div>
  )
}

export default ListOfExercises;