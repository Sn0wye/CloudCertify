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
              <p className='text-xl'>
                You got <span className='font-bold'>{score.correct}</span> out
                of <span className='font-bold'>{score.total}</span> questions
                correct
              </p>

              <div className='w-full max-w-md mt-4'>
                <Progress value={score.percentage} className='h-3' />
              </div>
            </div>

            <div className='space-y-6'>
              <h3 className='text-xl font-bold'>Question Summary</h3>
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
                  <div key={question.id} className='border rounded-lg p-4'>
                    <div className='flex items-start gap-3'>
                      {isCorrect ? (
                        <CheckCircle className='h-6 w-6 text-green-500 mt-1 flex-shrink-0' />
                      ) : (
                        <XCircle className='h-6 w-6 text-red-500 mt-1 flex-shrink-0' />
                      )}
                      <div className='space-y-2'>
                        <p className='font-medium'>
                          Question {index + 1}: {question.text}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Your answer:{' '}
                          <span
                            className={
                              isCorrect
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {userAnswer ? userAnswer.text : 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className='text-sm text-muted-foreground'>
                            Correct answer:{' '}
                            <span className='text-green-600 font-medium'>
                              {correctAnswer?.text}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
