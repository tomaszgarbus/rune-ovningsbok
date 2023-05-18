type ExerciseType = {
  id: string,
  title: string,
  img: string,
  img_credit?: string,
  runes: string | Array<string>,
  sources?: Array<String>
  description: string,
  explanationAfter: string
};

export default ExerciseType;