import { IsValidHttpUrl } from './Utils';

function ActiveExerciseImage(props) {
  return (
    <>
      <div className="ActiveExerciseImgDiv">
        <img
          src={require("./images/" + props.exercise.img)}
          className="ActiveExerciseImg"
          alt={props.exercise.title} />
      </div>
      {
        props.exercise.img_credit &&
        (
          <p className="ActiveExerciseImgCredit center">
            <b>{"Image credit: "}</b>
            {
              IsValidHttpUrl(props.exercise.img_credit) ?
              <a href={props.exercise.img_credit} target='_blank' rel='noreferrer'>link</a>
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