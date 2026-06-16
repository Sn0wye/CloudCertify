import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Cloud } from 'lucide-react';
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
import { postQuizQuizIdStart, postQuizQuizIdSubmit } from '@/http/generated/api';
import type {
  QuizDetailDto,
  QuizAnswer,
  QuizResultQuestionDto
} from '@/http/generated/api.schemas';

const PASS_THRESHOLD = 70;

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
  const [resultQuestions, setResultQuestions] = useState<QuizResultQuestionDto[] | null>(
    null
  );
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

  const header = (backHref: string, backLabel: string) => (
    <header className='sticky top-0 z-50 w-full border-b-2 border-black bg-white'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='flex gap-2 items-center text-xl font-black'>
          <div className='h-10 w-10 rounded-[5px] border-2 border-black bg-primary flex items-center justify-center shadow-[2px_2px_0px_0px_#000]'>
            <Cloud className='h-5 w-5 text-white' />
          </div>
          <span>CloudCertify</span>
        </Link>
        <Button variant='outline' size='sm' asChild>
          <Link href={backHref}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            {backLabel}
          </Link>
        </Button>
      </div>
    </header>
  );

  if (phase === 'results') {
    const percentage =
      totalQuestions && totalQuestions > 0
        ? Math.round(((score ?? 0) / totalQuestions) * 100)
        : 0;
    const passed = percentage >= PASS_THRESHOLD;

    return (
      <div className='flex min-h-dvh flex-col bg-background'>
        {header('/dashboard', 'Back to Dashboard')}
        <main className='flex-1 container max-w-4xl mx-auto py-12 px-4'>
          <Card className='w-full border-4 border-black shadow-[8px_8px_0px_0px_#000]'>
            <CardHeader className='text-center border-b-2 border-black pb-6'>
              <CardTitle className='text-2xl md:text-3xl font-black text-black'>
                Quiz results
              </CardTitle>
              <p className='text-black/70 font-medium mt-2'>{quizDetail.title}</p>
            </CardHeader>
            <CardContent className='space-y-8 py-8'>
              <div className='flex flex-col items-center justify-center space-y-4'>
                <div
                  className='h-32 w-32 rounded-[5px] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]'
                  style={{ backgroundColor: passed ? '#15a06e' : '#e23b48' }}
                >
                  <span className='text-5xl font-black text-white'>{percentage}%</span>
                </div>

                <Badge className={passed ? 'bg-success' : 'bg-destructive'}>
                  {passed ? 'PASS' : 'FAIL'} (Passing score: {PASS_THRESHOLD}%)
                </Badge>

                <p className='text-xl font-bold text-black'>
                  You got <span className='font-black'>{correctCount ?? 0}</span> out of{' '}
                  <span className='font-black'>{totalQuestions}</span> questions correct
                </p>

                <div className='w-full max-w-md mt-4'>
                  <Progress
                    value={percentage}
                    className={passed ? 'bg-success/20' : 'bg-destructive/20'}
                    indicatorClassName={passed ? 'bg-success' : 'bg-destructive'}
                  />
                </div>
              </div>

              <div className='space-y-6'>
                <h3 className='text-xl font-black text-black'>Question summary</h3>
                <Accordion type='single' collapsible className='w-full'>
                   {(resultQuestions ?? []).map((question, index) => {
                     const isCorrect = question.answers.every(
                       a => (a.isCorrect ? a.wasSelected : !a.wasSelected)
                     );

                    return (
                      <AccordionItem key={question.id} value={`question-${question.id}`}>
                        <AccordionTrigger className='hover:no-underline'>
                          <div className='flex items-start gap-3 text-left'>
                            <div
                              className={`h-6 w-6 rounded-[5px] border-2 border-black flex items-center justify-center shrink-0 ${
                                isCorrect ? 'bg-success' : 'bg-destructive'
                              }`}
                            >
                              {isCorrect ? (
                                <CheckCircle className='h-4 w-4 text-black' />
                              ) : (
                                <XCircle className='h-4 w-4 text-black' />
                              )}
                            </div>
                            <div>
                              <p className='font-bold text-black'>
                                Question {index + 1}: {question.text}
                              </p>
                              <p className='text-sm text-black/70 font-medium mt-1'>
                                {isCorrect ? 'Correct' : 'Incorrect'} - Click to view details
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='space-y-3 pt-2 pl-9'>
                            {question.answers.map(answer => {
                              const isCorrectAnswer = answer.isCorrect;
                              const isUserAnswer = answer.wasSelected;

                              let bgColor = 'bg-white';
                              if (isUserAnswer && isCorrectAnswer) {
                                bgColor = 'bg-success/15';
                              } else if (isUserAnswer && !isCorrectAnswer) {
                                bgColor = 'bg-destructive/15';
                              } else if (!isUserAnswer && isCorrectAnswer) {
                                bgColor = 'bg-success/15';
                              }

                              return (
                                <div
                                  key={answer.id}
                                  className={`p-3 rounded-[5px] border-2 border-black flex items-start gap-2 ${bgColor}`}
                                >
                                  <div
                                    className={`w-6 h-6 rounded-[5px] flex items-center justify-center border-2 border-black mt-0.5 shrink-0 ${
                                      isCorrectAnswer
                                        ? 'bg-black text-white'
                                        : isUserAnswer
                                        ? 'bg-black text-white'
                                        : 'bg-white'
                                    }`}
                                  >
                                    {isCorrectAnswer && <CheckCircle className='h-3 w-3' />}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <XCircle className='h-3 w-3' />
                                    )}
                                  </div>
                                  <div className='flex-1'>
                                    <span className='font-medium text-black'>
                                      {answer.text}
                                    </span>
                                    {isUserAnswer && (
                                      <span className='ml-2 text-sm font-bold text-black/70'>
                                        (Your answer)
                                      </span>
                                    )}
                                    {isCorrectAnswer && (
                                      <span className='ml-2 text-sm font-bold text-black'>
                                        (Correct answer)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col sm:flex-row gap-4 justify-between border-t-2 border-black pt-6'>
              <Button variant='outline' onClick={handleTryAgain} disabled={isRestarting}>
                {isRestarting ? 'Starting...' : 'Try Again'}
              </Button>
              <Button asChild>
                <Link href='/dashboard'>Back to Dashboard</Link>
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
      {header(`/quiz/${quizId}`, 'Back')}
      <main className='flex-1 container max-w-4xl mx-auto py-12 px-4'>
        <Card className='w-full border-4 border-black shadow-[8px_8px_0px_0px_#000]'>
          <CardHeader className='border-b-2 border-black pb-6'>
            <div className='flex justify-between items-center mb-4'>
              <Badge variant='outline'>
                Question {currentIndex + 1} of {questionsCount}
              </Badge>
              <Badge>{quizDetail.title}</Badge>
            </div>
            <CardTitle className='text-xl md:text-2xl font-black text-black'>
              {currentQuestion?.text}
            </CardTitle>
            {currentQuestion?.type === 'multiple_response' && (
              <p className='text-sm font-bold text-black/60 mt-2'>
                Select {currentQuestion.selectCount ?? 2} answers
              </p>
            )}
            <div className='w-full mt-6'>
              <Progress value={progress} />
            </div>
          </CardHeader>
           <CardContent className='py-6'>
            <div className='space-y-3'>
              {currentQuestion?.answers?.map(answer => {
                const selected = currentQuestion.id != null ? (userAnswers[currentQuestion.id] ?? []) : [];
                const isSelected = answer.id != null && selected.includes(answer.id);
                const isMultiResponse = currentQuestion.type === 'multiple_response';
                const atCap = isMultiResponse && selected.length >= (currentQuestion.selectCount ?? 1);
                const isDisabled = !isSelected && atCap;
                return (
                  <div
                    key={answer.id}
                    className={`p-4 rounded-[5px] border-2 border-black ${
                      isSelected
                        ? 'bg-primary shadow-none translate-x-[2px] translate-y-[2px]'
                        : 'bg-white hover:bg-background shadow-[4px_4px_0px_0px_#000]'
                    } ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} flex items-start gap-3 transition-all`}
                    onClick={() => !isDisabled && answer.id != null && handleAnswerSelect(answer.id)}
                  >
                    <div
                      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border-2 border-black mt-0.5 shrink-0 ${
                        isSelected ? 'bg-black text-white' : 'bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle className='h-4 w-4' />}
                    </div>
                    <span
                      className={`font-medium ${isSelected ? 'text-white' : 'text-black'}`}
                    >
                      {answer.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t-2 border-black pt-6'>
            <Button
              variant='outline'
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Previous
            </Button>
            {currentIndex < questionsCount - 1 ? (
              <Button onClick={() => setCurrentIndex(i => i + 1)}>
                Next
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Finish Quiz'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
