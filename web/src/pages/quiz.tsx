'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
import { Link } from 'wouter';
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

// Define types based on the provided data structure
type Answer = {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  createdAt: string;
};

type Question = {
  id: number;
  quizId: number;
  text: string;
  type: string;
  createdAt: string;
  answers: Answer[];
};

type Quiz = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  questions: Question[];
};

// Sample quiz data
const quizData: Quiz = {
  id: 1,
  title: 'AWS Cloud Practitioner (CLF-C02)',
  description: '',
  createdAt: '2025-03-30T00:31:34.728213Z',
  questions: [
    {
      id: 136,
      quizId: 1,
      text: 'Which of the following is NOT a benefit of using AWS Lambda?',
      type: 'multiple_choice',
      createdAt: '2025-03-30T00:31:34.728842Z',
      answers: [
        {
          id: 578,
          questionId: 136,
          text: 'AWS Lambda runs code without provisioning or managing servers.',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 579,
          questionId: 136,
          text: 'AWS Lambda provides resizable compute capacity in the cloud.',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 580,
          questionId: 136,
          text: 'There is no charge when your AWS Lambda code is not running.',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 581,
          questionId: 136,
          text: 'AWS Lambda can be called directly from any mobile app.',
          isCorrect: true,
          createdAt: '2025-03-30T00:31:34.728842Z'
        }
      ]
    },
    {
      id: 137,
      quizId: 1,
      text: 'Which AWS service is designed for storing and retrieving objects and is known for its durability?',
      type: 'multiple_choice',
      createdAt: '2025-03-30T00:31:34.728842Z',
      answers: [
        {
          id: 582,
          questionId: 137,
          text: 'Amazon EC2',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 583,
          questionId: 137,
          text: 'Amazon S3',
          isCorrect: true,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 584,
          questionId: 137,
          text: 'Amazon RDS',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 585,
          questionId: 137,
          text: 'Amazon VPC',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        }
      ]
    },
    {
      id: 138,
      quizId: 1,
      text: 'Which AWS service provides a virtual network dedicated to your AWS account?',
      type: 'multiple_choice',
      createdAt: '2025-03-30T00:31:34.728842Z',
      answers: [
        {
          id: 586,
          questionId: 138,
          text: 'Amazon VPC',
          isCorrect: true,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 587,
          questionId: 138,
          text: 'AWS Direct Connect',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 588,
          questionId: 138,
          text: 'Amazon Route 53',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        },
        {
          id: 589,
          questionId: 138,
          text: 'AWS Transit Gateway',
          isCorrect: false,
          createdAt: '2025-03-30T00:31:34.728842Z'
        }
      ]
    }
  ]
};

export function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answerId: number) => {
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: answerId });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData.questions.forEach(question => {
      const userAnswerId = userAnswers[question.id];
      const correctAnswer = question.answers.find(answer => answer.isCorrect);
      if (userAnswerId && correctAnswer && userAnswerId === correctAnswer.id) {
        correctAnswers++;
      }
    });
    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
  };

  const backToDashboard = (
    <Button variant='outline' size='sm' asChild>
      <Link href='/dashboard'>
        <ArrowLeft className='h-4 w-4' />
        Dashboard
      </Link>
    </Button>
  );

  if (quizCompleted) {
    const score = calculateScore();
    const passed = score.percentage >= PASS_THRESHOLD;

    return (
      <div className='flex min-h-dvh flex-col bg-background'>
        <SiteHeader>{backToDashboard}</SiteHeader>

        <main className='container mx-auto max-w-4xl flex-1 py-12'>
          <Card className='w-full gap-0'>
            <CardHeader className='items-center gap-2 border-b border-border pb-6 text-center'>
              <span className='hud-label text-primary'>[ RESULTS ]</span>
              <CardTitle className='text-2xl md:text-3xl'>Quiz results</CardTitle>
              <p className='text-sm text-muted-foreground'>{quizData.title}</p>
            </CardHeader>
            <CardContent className='space-y-8 py-8'>
              <ScorePanel
                percentage={score.percentage}
                passed={passed}
                correct={score.correct}
                total={score.total}
              />

              <div className='space-y-4'>
                <h3 className='font-display text-lg uppercase tracking-tight text-foreground'>
                  Question summary
                </h3>
                <Accordion type='single' collapsible className='w-full'>
                  {quizData.questions.map((question, index) => {
                    const userAnswerId = userAnswers[question.id];
                    const correctAnswer = question.answers.find(a => a.isCorrect);
                    const isCorrect =
                      !!userAnswerId &&
                      !!correctAnswer &&
                      userAnswerId === correctAnswer.id;

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
                                text={answer.text}
                                isCorrectAnswer={answer.isCorrect}
                                isUserAnswer={userAnswerId === answer.id}
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
              <Button variant='outline' onClick={restartQuiz}>
                Restart quiz
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
      <SiteHeader>{backToDashboard}</SiteHeader>

      <main className='container mx-auto max-w-4xl flex-1 py-12'>
        <Card className='w-full gap-0'>
          <CardHeader className='gap-0 border-b border-border pb-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Badge variant='outline'>
                Q {currentQuestionIndex + 1} / {totalQuestions}
              </Badge>
              <Badge>{quizData.title}</Badge>
            </div>
            <CardTitle className='text-xl normal-case md:text-2xl'>
              {currentQuestion.text}
            </CardTitle>
            <div className='mt-6 w-full'>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent className='py-6'>
            <div className='space-y-2'>
              {currentQuestion.answers.map((answer, index) => {
                const isSelected =
                  userAnswers[currentQuestion.id] === answer.id;
                return (
                  <OptionRow
                    key={answer.id}
                    label={String.fromCharCode(65 + index)}
                    text={answer.text}
                    isSelected={isSelected}
                    onClick={() => handleAnswerSelect(answer.id)}
                  />
                );
              })}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t border-border pt-6'>
            <Button
              variant='outline'
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className='h-4 w-4' />
              Previous
            </Button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button onClick={handleNextQuestion}>
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            ) : (
              <Button onClick={handleFinishQuiz}>Finish quiz</Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
