import { IsValidHttpUrl } from './Utils';

function ActiveExerciseImage(props) {
  return (
    <>
      <div className="ActiveExerciseImgDiv">
        <img
          src={"./assets/" + props.exercise.img}
          className="ActiveExerciseImg"
          alt={props.exercise.title} />
      </div>
      {
        props.exercise.img_credit &&
        (
          <p className="ActiveExerciseImgCredit">
            {"Image credit: "}
            {
              IsValidHttpUrl(props.exercise.img_credit) ?
              <a href={props.exercise.img_credit} target='_blank'>link</a>
              :
              <>{props.exercise.img_credit}</>
            }
          </p>
        )
      }
    </>
  );
}

export default ActiveExerciseImage;