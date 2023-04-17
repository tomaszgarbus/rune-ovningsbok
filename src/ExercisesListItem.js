/* TODO: Consider refactoring to a React Router Link. */

function ExercisesListItem(props) {
  return (
    <div className="ExercisesListItem" onClick={props.open}>
      <img
        src={"./images/thumbnails/" + props.exercise.img}
        onError={(e) => {
          e.target.onError = null;
          e.target.src = "./images/" + props.exercise.img;
        }}
        className="ExerciseThumbnail"
        alt={props.exercise.title} />
      <div className="ExerciseThumbnailGradient" />
      <svg className="ExerciseThumbnailRuneMask" opacity="0">
        <defs>
          <mask id={"mask" + props.exercise.runes[0]} x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff"/>
            <text textAnchor="middle" x="50%" y="75%" fontSize="150px">{
              props.exercise.runes[0]
            }</text>
          </mask>
        </defs>
        <rect width="100%" height="100%"
          mask={`url(#mask${props.exercise.runes[0]})`} fillOpacity="0.9"/>
      </svg>
      <div className="ExerciseListItemInfo">
        <p className="ExerciseListItemTitle">{props.exercise.title}</p>
        <p className="ExerciseListItemRowType">{props.runeRow.name}</p>
      </div>
    </div>
  )
}

export default ExercisesListItem;