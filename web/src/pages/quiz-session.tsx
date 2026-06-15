import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Footer } from '@/components/footer';
import { SiteHeader } from '@/components/site-header';
import {
  OptionRow,
  ReviewAnswerRow,
  ScorePanel,
  StatusGlyph,
  PASS_THRESHOLD
} from '@/components/quiz-ui';
import { postQuizQuizIdStart, postQuizQuizIdSubmit } from '@/http/generated/api';
import type {
  QuizDetailDto,
  QuizAnswer,
  QuizResultQuestionDto
} from '@/http/generated/api.schemas';

type SessionData = {
  quizDetail: QuizDetailDto;
  email: string;
};

type Phase = 'quiz' | 'results';

export function QuizSessionPage() {
  const params = useParams<{ id: string }>();
  const quizId = Number(params.id);
  const [, navigate] = useLocation();

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
  const [score, setScore] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number | null>(null);
  const [resultQuestions, setResultQuestions] = useState<
    QuizResultQuestionDto[] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`quiz-session-${quizId}`);
    if (!raw) {
      navigate(`/quiz/${quizId}`);
      return;
    }
    try {
      setSessionData(JSON.parse(raw));
    } catch {
      navigate(`/quiz/${quizId}`);
    }
  }, [quizId, navigate]);

  if (!sessionData) return null;

  const { quizDetail, email } = sessionData;
  const questions = quizDetail.questions ?? [];
  const questionsCount = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questionsCount) * 100;

  const handleAnswerSelect = (answerId: number) => {
    if (currentQuestion.id == null) return;
    const qId = currentQuestion.id!;
    const type = currentQuestion.type;
    const selectCount = currentQuestion.selectCount ?? 1;

    setUserAnswers(prev => {
      const current = prev[qId] ?? [];
      if (type === 'multiple_response') {
        if (current.includes(answerId)) {
          return { ...prev, [qId]: current.filter(id => id !== answerId) };
        }
        if (current.length >= selectCount) return prev;
        return { ...prev, [qId]: [...current, answerId] };
      }
      return { ...prev, [qId]: [answerId] };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const answers: QuizAnswer[] = Object.entries(userAnswers).map(
      ([questionId, answerIds]) => ({ questionId: Number(questionId), answerIds })
    );
    try {
      const res = await postQuizQuizIdSubmit(quizId, {
        submissionId: quizDetail.submissionId,
        answers
      });
      setScore(res.data.score);
      setTotalQuestions(res.data.totalQuestions);
      setCorrectCount(res.data.correctCount);
      setResultQuestions(res.data.questions);
      setPhase('results');
    } catch {
      // stay on quiz phase
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = async () => {
    setIsRestarting(true);
    try {
      const res = await postQuizQuizIdStart(quizId, { email });
      const newData: SessionData = { quizDetail: res.data, email };
      sessionStorage.setItem(`quiz-session-${quizId}`, JSON.stringify(newData));
      setSessionData(newData);
      setCurrentIndex(0);
      setUserAnswers({});
      setScore(null);
      setTotalQuestions(null);
      setCorrectCount(null);
      setResultQuestions(null);
      setPhase('quiz');
    } catch {
      // stay on results
    } finally {
      setIsRestarting(false);
    }
  };

  const headerAction = (backHref: string, backLabel: string) => (
    <Button variant='outline' size='sm' asChild>
      <Link href={backHref}>
        <ArrowLeft className='h-4 w-4' />
        {backLabel}
      </Link>
    </Button>
  );

  if (phase === 'results') {
    const percentage =
      totalQuestions && totalQuestions > 0
        ? Math.round(((score ?? 0) / totalQuestions) * 100)
        : 0;
    const passed = percentage >= PASS_THRESHOLD;

    return (
      <div className='flex min-h-dvh flex-col bg-background'>
        <SiteHeader>{headerAction('/dashboard', 'Dashboard')}</SiteHeader>
        <main className='container mx-auto max-w-4xl flex-1 py-12'>
          <Card className='w-full gap-0'>
            <CardHeader className='items-center gap-2 border-b border-border pb-6 text-center'>
              <span className='hud-label text-primary'>[ RESULTS ]</span>
              <CardTitle className='text-2xl md:text-3xl'>Quiz results</CardTitle>
              <p className='text-sm text-muted-foreground'>{quizDetail.title}</p>
            </CardHeader>
            <CardContent className='space-y-8 py-8'>
              <ScorePanel
                percentage={percentage}
                passed={passed}
                correct={correctCount ?? 0}
                total={totalQuestions ?? 0}
              />

              <div className='space-y-4'>
                <h3 className='font-display text-lg uppercase tracking-tight text-foreground'>
                  Question summary
                </h3>
                <Accordion type='single' collapsible className='w-full'>
                  {(resultQuestions ?? []).map((question, index) => {
                    const isCorrect = question.answers.every(a =>
                      a.isCorrect ? a.wasSelected : !a.wasSelected
                    );

                    return (
                      <AccordionItem
                        key={question.id}
                        value={`question-${question.id}`}
                      >
                        <AccordionTrigger className='hover:no-underline'>
                          <div className='flex items-start gap-3 text-left'>
                            <StatusGlyph correct={isCorrect} />
                            <div>
                              <p className='font-semibold normal-case text-foreground'>
                                Q{index + 1}: {question.text}
                              </p>
                              <p className='hud-label mt-1'>
                                {isCorrect ? 'Correct' : 'Incorrect'} · view detail
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='space-y-2 pl-9 pt-2'>
                            {question.answers.map(answer => (
                              <ReviewAnswerRow
                                key={answer.id}
                                text={answer.text ?? ''}
                                isCorrectAnswer={answer.isCorrect}
                                isUserAnswer={answer.wasSelected}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col justify-between gap-4 border-t border-border pt-6 sm:flex-row'>
              <Button
                variant='outline'
                onClick={handleTryAgain}
                disabled={isRestarting}
              >
                {isRestarting ? 'Starting...' : 'Try again'}
              </Button>
              <Button asChild>
                <Link href='/dashboard'>Back to dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <SiteHeader>{headerAction(`/quiz/${quizId}`, 'Back')}</SiteHeader>
      <main className='container mx-auto max-w-4xl flex-1 py-12'>
        <Card className='w-full gap-0'>
          <CardHeader className='gap-0 border-b border-border pb-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Badge variant='outline'>
                Q {currentIndex + 1} / {questionsCount}
              </Badge>
              <Badge>{quizDetail.title}</Badge>
            </div>
            <CardTitle className='text-xl normal-case md:text-2xl'>
              {currentQuestion?.text}
            </CardTitle>
            {currentQuestion?.type === 'multiple_response' && (
              <p className='hud-label mt-2 text-primary'>
                Select {currentQuestion.selectCount ?? 2} answers
              </p>
            )}
            <div className='mt-6 w-full'>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent className='py-6'>
            <div className='space-y-2'>
              {currentQuestion?.answers?.map((answer, index) => {
                const selected =
                  currentQuestion.id != null
                    ? (userAnswers[currentQuestion.id] ?? [])
                    : [];
                const isSelected =
                  answer.id != null && selected.includes(answer.id);
                const isMultiResponse =
                  currentQuestion.type === 'multiple_response';
                const atCap =
                  isMultiResponse &&
                  selected.length >= (currentQuestion.selectCount ?? 1);
                const isDisabled = !isSelected && atCap;
                return (
                  <OptionRow
                    key={answer.id}
                    label={String.fromCharCode(65 + index)}
                    text={answer.text ?? ''}
                    isSelected={isSelected}
                    disabled={isDisabled}
                    onClick={() =>
                      answer.id != null && handleAnswerSelect(answer.id)
                    }
                  />
                );
              })}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t border-border pt-6'>
            <Button
              variant='outline'
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className='h-4 w-4' />
              Previous
            </Button>
            {currentIndex < questionsCount - 1 ? (
              <Button onClick={() => setCurrentIndex(i => i + 1)}>
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Finish quiz'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
