import useStyles from './styles';

type AnswersSectionProps = {
  category: string;
};

const AnswersSection = ({ category }: AnswersSectionProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <div className={classes.title}>{category}</div>
    </div>
  );
};

export default AnswersSection;
