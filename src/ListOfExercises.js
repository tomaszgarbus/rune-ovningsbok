import ExercisesListItem from './ExercisesListItem';

function ListOfExercises(props) {
  return (
    <div className='ExercisesListParent'>
      <h1>Welcome to Runor Övningsbok</h1>
      <h2>Pick an exercise to get started</h2>
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
    </div>
  )
}

export default ListOfExercises;