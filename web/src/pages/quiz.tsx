'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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

// Pass threshold percentage
const PASS_THRESHOLD = 70;

export default function QuizPage() {
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

  if (quizCompleted) {
    const score = calculateScore();
    const passed = score.percentage >= PASS_THRESHOLD;

    return (
      <div className='container max-w-4xl mx-auto py-12 px-4'>
        <Card className='w-full'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl md:text-3xl'>Quiz Results</CardTitle>
            <CardDescription>{quizData.title}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-8'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='text-6xl font-bold text-sky-600'>
                {score.percentage}%
              </div>

              <Badge
                className={`px-3 py-1 text-sm ${
                  passed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {passed ? 'PASS' : 'FAIL'} (Passing score: {PASS_THRESHOLD}%)
              </Badge>

              <p className='text-xl'>
                You got <span className='font-bold'>{score.correct}</span> out
                of <span className='font-bold'>{score.total}</span> questions
                correct
              </p>

              <div className='w-full max-w-md mt-4'>
                <Progress
                  value={score.percentage}
                  className={`h-3 ${passed ? 'bg-green-100' : 'bg-red-100'}`}
                  indicatorClassName={passed ? 'bg-green-500' : 'bg-red-500'}
                />
              </div>
            </div>

            <div className='space-y-6'>
              <h3 className='text-xl font-bold'>Question Summary</h3>
              <Accordion type='single' collapsible className='w-full'>
                {quizData.questions.map((question, index) => {
                  const userAnswerId = userAnswers[question.id];
                  const userAnswer = question.answers.find(
                    a => a.id === userAnswerId
                  );
                  const correctAnswer = question.answers.find(a => a.isCorrect);
                  const isCorrect =
                    userAnswerId &&
                    correctAnswer &&
                    userAnswerId === correctAnswer.id;

                  return (
                    <AccordionItem
                      key={question.id}
                      value={`question-${question.id}`}
                    >
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex items-start gap-3 text-left'>
                          {isCorrect ? (
                            <CheckCircle className='h-6 w-6 text-green-500 mt-1 flex-shrink-0' />
                          ) : (
                            <XCircle className='h-6 w-6 text-red-500 mt-1 flex-shrink-0' />
                          )}
                          <div>
                            <p className='font-medium'>
                              Question {index + 1}: {question.text}
                            </p>
                            <p className='text-sm text-muted-foreground mt-1'>
                              {isCorrect ? 'Correct' : 'Incorrect'} - Click to
                              view details
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='space-y-3 pt-2 pl-9'>
                          {question.answers.map(answer => {
                            const isUserAnswer = userAnswerId === answer.id;
                            const isCorrectAnswer = answer.isCorrect;

                            let className =
                              'p-3 rounded-md border flex items-start gap-2';

                            if (isUserAnswer && isCorrectAnswer) {
                              className += ' border-green-500 bg-green-50';
                            } else if (isUserAnswer && !isCorrectAnswer) {
                              className += ' border-red-500 bg-red-50';
                            } else if (!isUserAnswer && isCorrectAnswer) {
                              className += ' border-green-500 bg-green-50';
                            }

                            return (
                              <div key={answer.id} className={className}>
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                    isCorrectAnswer
                                      ? 'bg-green-500 text-white'
                                      : isUserAnswer
                                      ? 'bg-red-500 text-white'
                                      : 'border border-input'
                                  }`}
                                >
                                  {isCorrectAnswer && (
                                    <CheckCircle className='h-3 w-3' />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle className='h-3 w-3' />
                                  )}
                                </div>
                                <div className='flex-1'>
                                  <span>{answer.text}</span>
                                  {isUserAnswer && (
                                    <span className='ml-2 text-sm font-medium text-muted-foreground'>
                                      (Your answer)
                                    </span>
                                  )}
                                  {isCorrectAnswer && (
                                    <span className='ml-2 text-sm font-medium text-green-600'>
                                      (Correct answer)
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* {question.id === 136 && (
                            <div className='mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100'>
                              <h4 className='font-medium'>Explanation</h4>
                              <p className='mt-1 text-muted-foreground'>
                                AWS Lambda cannot be called directly from a
                                mobile app without using an API Gateway or other
                                AWS service as an intermediary. The other
                                options are all valid benefits of AWS Lambda.
                              </p>
                            </div>
                          )}
                          {question.id === 137 && (
                            <div className='mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100'>
                              <h4 className='font-medium'>Explanation</h4>
                              <p className='mt-1 text-muted-foreground'>
                                Amazon S3 (Simple Storage Service) is designed
                                specifically for object storage and is known for
                                its 99.999999999% (11 nines) durability.
                              </p>
                            </div>
                          )}
                          {question.id === 138 && (
                            <div className='mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100'>
                              <h4 className='font-medium'>Explanation</h4>
                              <p className='mt-1 text-muted-foreground'>
                                Amazon VPC (Virtual Private Cloud) provides a
                                logically isolated section of the AWS Cloud
                                where you can launch AWS resources in a virtual
                                network that you define.
                              </p>
                            </div>
                          )} */}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col sm:flex-row gap-4 justify-between'>
            <Button variant='outline' onClick={restartQuiz}>
              Restart Quiz
            </Button>
            <Button asChild>
              <Link href='/'>Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='container max-w-4xl mx-auto py-12 px-4'>
      <Card className='w-full'>
        <CardHeader>
          <div className='flex justify-between items-center mb-2'>
            <Badge variant='outline' className='bg-sky-50'>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Badge>
            <Badge variant='secondary'>{quizData.title}</Badge>
          </div>
          <CardTitle className='text-xl md:text-2xl'>
            {currentQuestion.text}
          </CardTitle>
          <div className='w-full mt-4'>
            <Progress value={progress} className='h-2' />
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            {currentQuestion.answers.map(answer => {
              const isSelected = userAnswers[currentQuestion.id] === answer.id;

              return (
                <div
                  key={answer.id}
                  className={`p-4 rounded-md border ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-input hover:border-sky-500 hover:bg-sky-50'
                  } flex items-start gap-3 cursor-pointer transition-all`}
                  onClick={() => handleAnswerSelect(answer.id)}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 flex-shrink-0 ${
                      isSelected
                        ? 'bg-sky-500 text-white'
                        : 'border border-input'
                    }`}
                  >
                    {isSelected && <CheckCircle className='h-3 w-3' />}
                  </div>
                  <span>{answer.text}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Previous
          </Button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <Button onClick={handleFinishQuiz}>Finish Quiz</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
