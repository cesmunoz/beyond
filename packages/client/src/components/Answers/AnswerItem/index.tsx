import cn from 'classnames';
import useStyles from './styles';

type AnswerItemProps = {
  question: string;
  value: number;
};

const AnswersItem = ({ question, value }: AnswerItemProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={`flex ${classes.itemSection}`}>
      <div className={cn('flex items-center', classes.question)}>{question}</div>
      <div className={`flex justify-between ${classes.dotSection}`}>
        {[...Array(5)].map((x, i) => (
          <div
            key={x}
            className={cn(`${classes.dot}`, {
              [classes.selected]: value > i,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default AnswersItem;
