function ExercisesListItem(props) {
  return (
    <div>
      <a onClick={props.open}>
        <p>{props.exercise.title}</p>
      </a>
    </div>
  )
}

export default ExercisesListItem;