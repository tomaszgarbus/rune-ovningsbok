import ExercisesListItem from './ExercisesListItem';

function ListOfExercises(props) {
  return (
    <div className='ExercisesList'>
      {
        props.items.map(
          exercise => <ExercisesListItem
            exercise={exercise}
            key={exercise.id}
            open={_ => props.setExercise(exercise)}
            runeRow={props.runeRows[exercise.rowType]}
            />)
      }
    </div>
  )
}

export default ListOfExercises;