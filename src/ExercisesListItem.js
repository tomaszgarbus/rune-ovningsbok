function ExercisesListItem(props) {
  console.log(props.exercise);
  console.log("assets/" + props.exercise.img);
  return (
    <div className="ExercisesListItem">
      <img src={"./assets/" + props.exercise.img} className="ExerciseThumbnail" />
      {/* TODO: should this be a link instead? */}
      <p onClick={props.open} className="ExerciseListItemTitle">{props.exercise.title}</p>
    </div>
  )
}

export default ExercisesListItem;