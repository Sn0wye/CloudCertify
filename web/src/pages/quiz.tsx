'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Cloud } from 'lucide-react';
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

  if (quizCompleted) {
    const score = calculateScore();
    const passed = score.percentage >= PASS_THRESHOLD;

    return (
      <div className='flex min-h-screen flex-col bg-[#f0f9ff]'>
        <header className='sticky top-0 z-50 w-full border-b-2 border-black bg-white'>
          <div className='container flex h-16 items-center justify-between'>
            <Link href='/' className='flex gap-2 items-center text-xl font-black'>
              <div className='h-10 w-10 rounded-[5px] border-2 border-black bg-[#38bdf8] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]'>
                <Cloud className='h-5 w-5 text-black' />
              </div>
              <span>CloudCertify</span>
            </Link>
            <div className='flex items-center gap-4'>
              <Button variant='outline' size='sm' asChild>
                <Link href='/dashboard'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className='flex-1 container max-w-4xl mx-auto py-12 px-4'>
          <Card className='w-full border-4 border-black shadow-[8px_8px_0px_0px_#000]'>
            <CardHeader className='text-center border-b-2 border-black pb-6'>
              <CardTitle className='text-2xl md:text-3xl font-black text-black'>Quiz Results</CardTitle>
              <p className='text-black/70 font-medium mt-2'>{quizData.title}</p>
            </CardHeader>
            <CardContent className='space-y-8 py-8'>
              <div className='flex flex-col items-center justify-center space-y-4'>
                <div className='h-32 w-32 rounded-[5px] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]'
                  style={{ backgroundColor: passed ? '#1dd1a1' : '#ff4757' }}>
                  <span className='text-5xl font-black text-black'>{score.percentage}%</span>
                </div>

                <Badge
                  className={passed ? 'bg-[#1dd1a1]' : 'bg-[#ff4757]'}
                >
                  {passed ? 'PASS' : 'FAIL'} (Passing score: {PASS_THRESHOLD}%)
                </Badge>

                <p className='text-xl font-bold text-black'>
                  You got <span className='font-black'>{score.correct}</span> out
                  of <span className='font-black'>{score.total}</span> questions
                  correct
                </p>

                <div className='w-full max-w-md mt-4'>
                  <Progress
                    value={score.percentage}
                    className={passed ? 'bg-[#1dd1a1]/20' : 'bg-[#ff4757]/20'}
                    indicatorClassName={passed ? 'bg-[#1dd1a1]' : 'bg-[#ff4757]'}
                  />
                </div>
              </div>

              <div className='space-y-6'>
                <h3 className='text-xl font-black text-black'>Question Summary</h3>
                <Accordion type='single' collapsible className='w-full'>
                  {quizData.questions.map((question, index) => {
                    const userAnswerId = userAnswers[question.id];
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
                            <div className={`h-6 w-6 rounded-[5px] border-2 border-black flex items-center justify-center shrink-0 ${isCorrect ? 'bg-[#1dd1a1]' : 'bg-[#ff4757]'}`}>
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

                              let bgColor = 'bg-white';
                              if (isUserAnswer && isCorrectAnswer) {
                                bgColor = 'bg-[#1dd1a1]';
                              } else if (isUserAnswer && !isCorrectAnswer) {
                                bgColor = 'bg-[#ff4757]';
                              } else if (!isUserAnswer && isCorrectAnswer) {
                                bgColor = 'bg-[#1dd1a1]';
                              }

                              return (
                                <div key={answer.id} className={`p-3 rounded-[5px] border-2 border-black flex items-start gap-2 ${bgColor}`}>
                                  <div
                                    className={`w-6 h-6 rounded-[5px] flex items-center justify-center border-2 border-black mt-0.5 shrink-0 ${
                                      isCorrectAnswer
                                        ? 'bg-black text-white'
                                        : isUserAnswer
                                        ? 'bg-black text-white'
                                        : 'bg-white'
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
                                    <span className='font-medium text-black'>{answer.text}</span>
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
              <Button variant='outline' onClick={restartQuiz}>
                Restart Quiz
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
    <div className='flex min-h-screen flex-col bg-[#f0f9ff]'>
      <header className='sticky top-0 z-50 w-full border-b-2 border-black bg-white'>
        <div className='container flex h-16 items-center justify-between'>
          <Link href='/' className='flex gap-2 items-center text-xl font-black'>
            <div className='h-10 w-10 rounded-[5px] border-2 border-black bg-[#38bdf8] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]'>
              <Cloud className='h-5 w-5 text-black' />
            </div>
            <span>CloudCertify</span>
          </Link>
          <div className='flex items-center gap-4'>
            <Button variant='outline' size='sm' asChild>
              <Link href='/dashboard'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 container max-w-4xl mx-auto py-12 px-4'>
        <Card className='w-full border-4 border-black shadow-[8px_8px_0px_0px_#000]'>
          <CardHeader className='border-b-2 border-black pb-6'>
            <div className='flex justify-between items-center mb-4'>
              <Badge variant='outline'>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Badge>
              <Badge>{quizData.title}</Badge>
            </div>
            <CardTitle className='text-xl md:text-2xl font-black text-black'>
              {currentQuestion.text}
            </CardTitle>
            <div className='w-full mt-6'>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent className='py-6'>
            <div className='space-y-3'>
              {currentQuestion.answers.map(answer => {
                const isSelected = userAnswers[currentQuestion.id] === answer.id;

                return (
                  <div
                    key={answer.id}
                    className={`p-4 rounded-[5px] border-2 border-black ${
                      isSelected
                        ? 'bg-[#38bdf8] shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-white hover:bg-[#f0f9ff]'
                    } flex items-start gap-3 cursor-pointer transition-all`}
                    onClick={() => handleAnswerSelect(answer.id)}
                  >
                    <div
                      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border-2 border-black mt-0.5 shrink-0 ${
                        isSelected
                          ? 'bg-black text-white'
                          : 'bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle className='h-4 w-4' />}
                    </div>
                    <span className='font-medium text-black'>{answer.text}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t-2 border-black pt-6'>
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
      </main>
      <Footer />
    </div>
  );
}
