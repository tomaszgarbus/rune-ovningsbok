function ExercisesListItem(props) {
  return (
    <div>
      {/* TODO: should this be a link instead? */}
      <p onClick={props.open}>{props.exercise.title}</p>
    </div>
  )
}

export default ExercisesListItem;