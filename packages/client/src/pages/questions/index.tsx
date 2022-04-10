import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { COACHEE, ANON } from '@beyond/lib/constants';

import AboutMe from 'components/Wizard/AboutMe';
import Box from 'components/Box';
import Collaborators from 'components/Wizard/Collaborators';
import Education from 'components/Wizard/Education';
import End from 'components/Wizard/End';
import Interlude from 'components/Wizard/Interlude';
import Start from 'components/Wizard/Start';
import Wizard from 'components/Wizard';
import Work from 'components/Wizard/Work';
import { withAuth } from 'components/withAuth';

import {
  saveQuestionnaire,
  getProcess,
  getEvaluatorProcess,
  saveEvaluatorAnswers,
} from 'api/processes';
import { QuestionnaireSection } from 'appState/questionnaires';
import useTypedSelector from 'selectors/typedSelector';
import {
  getCurrentStep,
  getFormQuestions,
  getProcessIsCompleted,
  getFormData,
} from 'selectors/form';

import Colors from 'styles/colors';
import { StepKey } from 'types';
import Loading from 'components/Loading';
import { ValidAny } from '@beyond/lib/types';
import { getProcessSelector } from 'selectors/processes';
import { ROOT } from 'constants/routes';
import { ProcessType } from '@beyond/lib/enums';
import Expectation from 'components/Wizard/Expectation';
import Question from 'components/Wizard/Question';
import CloudBackground from '../../../public/clouds.svg';
import { useDesktopStyles, useMobileStyles } from './styles';

type Step = {
  name: StepKey;
  milestone: boolean;
  visible: boolean;
};

export function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[],
): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}

const buildSteps = (
  categories: QuestionnaireSection[],
  isEvaluator: boolean,
  isTeamOwnerAnswering?: boolean,
): Step[] => {
  const categorySteps: Step[] = flatMap(
    categories.filter(c => !c.onlyEvaluator),
    (c: QuestionnaireSection) => [
      ...c.questions.map(({ question }, index) => ({
        name: question as ValidAny,
        milestone: false,
        visible: index === 0,
      })),
    ],
  );

  const steps: Step[] = [{ name: 'Start', milestone: true, visible: true }];

  if (!isEvaluator) {
    steps.push(
      { name: 'AboutMe', milestone: false, visible: true },
      { name: 'Education', milestone: false, visible: true },
      { name: 'Work', milestone: false, visible: true },
      { name: 'Expectation', milestone: false, visible: true },
      { name: 'Interlude_1', milestone: true, visible: true },
    );
  }
  steps.push(...categorySteps);

  if (isEvaluator) {
    const evaluatorSteps: Step[] = flatMap(
      categories.filter(c => c.onlyEvaluator),
      (c: QuestionnaireSection) => [
        ...c.questions.map(({ evaluator }, index) => ({
          name: evaluator as ValidAny,
          milestone: false,
          visible: index === 0,
        })),
      ],
    );

    steps.push(...evaluatorSteps);
  }

  if (!isEvaluator && isTeamOwnerAnswering) {
    steps.push(
      { name: 'Interlude_2', milestone: true, visible: true },
      { name: 'Collaborators', milestone: false, visible: true },
    );
  }

  steps.push({ name: 'End', milestone: true, visible: true });

  return steps;
};

const Questionnaire = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mobile, auth } = useTypedSelector(state => state);
  const questionnaireData = useTypedSelector(getFormData);
  const lastStep = useTypedSelector(getCurrentStep);
  const processIsCompleted = useTypedSelector(getProcessIsCompleted);
  const loading = useTypedSelector(state => state.loading.questions || state.loading.processDetail);
  const processId = router.query.id as string;
  const evaluatorEmail = router.query.email as string;
  const process = useTypedSelector(state => getProcessSelector(state, processId));
  const questionsCategories = useTypedSelector(state =>
    getFormQuestions(state, process.type, process.formVersion),
  );

  const isEvaluator = auth.role === ANON;

  useEffect(() => {
    if (isEvaluator && !evaluatorEmail) {
      router.push(ROOT);
    }
  }, []);

  const classes = mobile ? useMobileStyles() : useDesktopStyles();

  useEffect(() => {
    if (!processId) {
      return;
    }

    if (isEvaluator) {
      dispatch(getEvaluatorProcess(processId, evaluatorEmail));
      return;
    }

    dispatch(getProcess(processId));
  }, [processId]);

  const isTeamProcess = process.type === ProcessType.TEAM;
  const isTeamOwnerAnswering = (process as ValidAny).owner === auth.email;
  const steps = buildSteps(questionsCategories, isEvaluator, isTeamOwnerAnswering);

  const [currentStep, setCurrentStep] = useState<StepKey>(lastStep || 'Start');

  useEffect(() => {
    if (process.processId) {
      setCurrentStep(lastStep);
    }
  }, [process.processId]);

  const handleOnStepChange = (newStep: number): void => {
    const currentStepIndex = steps.findIndex(c => c.name === currentStep);
    setCurrentStep(steps[currentStepIndex + newStep].name);
  };

  const handleOnSaveClick = (): void => {
    if (!isEvaluator) {
      dispatch(
        saveQuestionnaire(processId, {
          ...questionnaireData,
          collaborators: questionnaireData.collaborators.filter(c => c.email !== auth.email),
          formType: process.type,
          formVersion: process.formVersion,
        }),
      );
    } else {
      dispatch(
        saveEvaluatorAnswers(processId, evaluatorEmail, {
          questionnaire: questionnaireData.questionnaire,
        }),
      );
    }
    setCurrentStep('End');
  };

  const getBoxClass = (): string => {
    if (mobile) {
      if (['Start', 'End', 'Interlude_1', 'Interlude_2'].includes(currentStep)) {
        return '';
      }

      return classes.smallBox;
    }

    if (['Start', 'Education', 'Interlude_1', 'Interlude_2'].includes(currentStep)) {
      return classes.smallBox;
    }

    if (['AboutMe', 'Work', 'End'].includes(currentStep)) {
      return classes.mediumBox;
    }

    if (currentStep === 'Collaborators') {
      return classes.bigBox;
    }

    return classes.mediumBox;
  };

  const renderQuestions = (questions: QuestionnaireSection[]): JSX.Element[][] => {
    return questions.map((category, catIndex) => {
      return (category.questions || []).map((q, qIndex, total) => {
        return (
          <Question
            type={q.type}
            key={`${q.question || q.evaluator}_${q.id}`}
            category={category.category}
            onStepChange={handleOnStepChange}
            text={isEvaluator ? q.evaluator : q.question}
            onSaveClick={
              (((isEvaluator || !isTeamOwnerAnswering) &&
                catIndex === questionsCategories.length - 1) ||
                (isEvaluator && category.onlyEvaluator)) &&
              qIndex === total.length - 1
                ? handleOnSaveClick
                : undefined
            }
            id={q.id}
          />
        );
      });
    });
  };

  const renderSteps = (): JSX.Element[] => {
    let baseSteps: JSX.Element[] = [];

    const { alreadyAnswered } = process as ValidAny;

    if (!alreadyAnswered) {
      baseSteps.push(
        <Start
          key="start"
          isEvaluator={isEvaluator}
          isTeamProcess={isTeamProcess}
          name={(process.personalInfo || {}).fullName || auth.fullName}
          onClick={(): void => handleOnStepChange(1)}
        />,
      );

      if (!isEvaluator) {
        baseSteps.push(
          <AboutMe key="about-me" onStepChange={handleOnStepChange} />,
          <Education key="education" onStepChange={handleOnStepChange} />,
          <Work key="work" onStepChange={handleOnStepChange} />,
          <Expectation key="expectation" onStepChange={handleOnStepChange} />,
          <Interlude
            key="interlude-1"
            onSaveClick={handleOnSaveClick}
            onStepChange={handleOnStepChange}
            subtitle="¡Llegamos a la mejor parte!"
            title="Te pediremos que nos cuentes cómo te sientes en tu entorno."
          />,
        );
      }

      if (questionsCategories.length) {
        baseSteps = baseSteps.concat(
          ...renderQuestions(questionsCategories.filter(c => !c.onlyEvaluator)),
        );

        if (isEvaluator) {
          baseSteps = baseSteps.concat(
            ...renderQuestions(questionsCategories.filter(c => c.onlyEvaluator)),
          );
        }
      }

      if (!isEvaluator && isTeamOwnerAnswering) {
        baseSteps.push(
          <Interlude
            key="interlude-2"
            onSaveClick={handleOnSaveClick}
            onStepChange={handleOnStepChange}
            subtitle="¡Sólo un paso más!"
            title={
              isTeamProcess
                ? 'Elige a los miembros de tu equipo para que nos den su opinión'
                : 'Elige 5 colaboradores para que nos den una opinión sobre ti'
            }
          />,
          <Collaborators
            key="collaborators"
            isTeamProcess={isTeamProcess}
            onStepChange={handleOnStepChange}
            onSaveClick={handleOnSaveClick}
          />,
        );
      }
    }

    baseSteps.push(
      <End
        key="end"
        isProcessCompleted={processIsCompleted}
        isExitButtonVisible={!isEvaluator}
        isAlreadyAnswered={alreadyAnswered}
        isTeamProcess={isTeamProcess}
        isEvaluator={isEvaluator}
      />,
    );

    return baseSteps;
  };

  return (
    <main
      className={cn('page-background flex-center-x h-full w-full', {
        'py-8': !mobile || ['Start', 'End', 'Interlude_1', 'Interlude_2'].includes(currentStep),
      })}
    >
      <Box className={cn(classes.box, getBoxClass())}>
        {loading ? (
          <Loading />
        ) : (
          <Wizard steps={steps} currentStep={currentStep}>
            {renderSteps()}
          </Wizard>
        )}
      </Box>
      <style jsx>
        {`
          .page-background {
            background: url(${CloudBackground}) no-repeat center/70%,
              linear-gradient(
                to bottom,
                ${Colors.Backgrounds.LightTurquoise} 0%,
                ${Colors.Backgrounds.Gray} 100%
              );
          }
        `}
      </style>
    </main>
  );
};

export default withAuth(Questionnaire, [COACHEE, ANON]);
