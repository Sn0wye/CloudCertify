import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Cloud, Lock, Target, Zap } from 'lucide-react';
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
import { Footer } from '@/components/footer';
import {
  postQuizQuizIdStart,
  postQuizQuizIdSubquizzesSubquizIdStart,
  useGetQuizQuizId
} from '@/http/generated/api';
import type { SubquizDto } from '@/http/generated/api.schemas';
import { getLucideIcon } from '@/lib/quiz-icon';
import { capitalize } from '@/lib/utils';

const LEVEL_COLORS: Record<string, string> = {
  foundational: 'bg-[#1dd1a1]',
  associate: 'bg-[#38bdf8]',
  professional: 'bg-[#a78bfa]',
  specialist: 'bg-[#a78bfa]'
};

const PROVIDER_LABELS: Record<string, string> = {
  aws: 'Amazon Web Services',
  gcp: 'Google Cloud',
  azure: 'Microsoft Azure'
};

export function QuizDetailPage() {
  const params = useParams<{ id: string }>();
  const quizId = Number(params.id);
  const [, navigate] = useLocation();

  const { data, isLoading } = useGetQuizQuizId(quizId);
  const quiz = data?.data;

  const [email, setEmail] = useState(() => {
    try {
      const raw = sessionStorage.getItem(`quiz-session-${quizId}`);
      if (raw) return JSON.parse(raw).email ?? '';
    } catch {}
    return '';
  });

  const [isStartingExam, setIsStartingExam] = useState(false);
  const [startingSubquizId, setStartingSubquizId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartExam = async () => {
    if (!email.trim()) return;
    setIsStartingExam(true);
    setError(null);
    try {
      const response = await postQuizQuizIdStart(quizId, { email });
      sessionStorage.setItem(
        `quiz-session-${quizId}`,
        JSON.stringify({ quizDetail: response.data, email })
      );
      navigate(`/quiz/${quizId}/session`);
    } catch {
      setError('Failed to start the exam. Please try again.');
    } finally {
      setIsStartingExam(false);
    }
  };

  const handleStartSubquiz = async (subquiz: SubquizDto) => {
    if (!email.trim()) {
      setError('Please enter your email first.');
      return;
    }
    setStartingSubquizId(subquiz.id);
    setError(null);
    try {
      const response = await postQuizQuizIdSubquizzesSubquizIdStart(quizId, subquiz.id, {
        email
      });
      sessionStorage.setItem(
        `subquiz-session-${quizId}-${subquiz.id}`,
        JSON.stringify({ subquizDetail: response.data, email })
      );
      navigate(`/quiz/${quizId}/subquiz/${subquiz.id}/session`);
    } catch {
      setError('Failed to start the practice. Please try again.');
    } finally {
      setStartingSubquizId(null);
    }
  };

  const levelColor =
    quiz?.quizLevel ? (LEVEL_COLORS[quiz.quizLevel] ?? 'bg-[#38bdf8]') : 'bg-[#38bdf8]';
  const subquizzes = quiz?.subQuizzes ?? [];

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
          <Button variant='outline' size='sm' asChild>
            <Link href='/dashboard'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className='flex-1 container max-w-3xl mx-auto py-12 px-4 space-y-10'>
        {isLoading ? (
          <div className='h-64 animate-pulse rounded-[5px] border-2 border-dashed border-black bg-white' />
        ) : quiz ? (
          <>
            {/* Certification header */}
            <div className='flex flex-col items-center text-center space-y-4'>
              <div
                className={`h-20 w-20 rounded-[5px] border-2 border-black ${levelColor} flex items-center justify-center shadow-[4px_4px_0px_0px_#000]`}
              >
                {getLucideIcon(quiz.iconName, { className: 'h-10 w-10 text-black' })}
              </div>
              <h1 className='text-3xl md:text-4xl font-black text-black text-balance'>
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className='text-black/70 font-medium max-w-xl text-pretty'>
                  {quiz.description}
                </p>
              )}
              <div className='flex justify-center gap-3 flex-wrap'>
                {quiz.quizProvider && (
                  <Badge className='bg-[#38bdf8] border-2 border-black text-black font-bold'>
                    {PROVIDER_LABELS[quiz.quizProvider] ?? quiz.quizProvider.toUpperCase()}
                  </Badge>
                )}
                {quiz.quizLevel && (
                  <Badge
                    className={`${levelColor} border-2 border-black text-black font-bold`}
                  >
                    {capitalize(quiz.quizLevel)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Shared email input */}
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-sm font-black text-black'>
                Your email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full rounded-[5px] border-2 border-black px-4 py-3 text-black font-medium placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] bg-white shadow-[2px_2px_0px_0px_#000]'
              />
              {error && <p className='text-sm font-bold text-[#ff4757]'>{error}</p>}
            </div>

            {/* Full Simulation Exam */}
            <section className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Target className='h-5 w-5 text-black' />
                <h2 className='text-xl font-black text-black'>Full Simulation Exam</h2>
              </div>
              <Card className='border-4 border-black shadow-[6px_6px_0px_0px_#000]'>
                <CardHeader className='border-b-2 border-black pb-4'>
                  <CardTitle className='text-lg font-black text-black'>{quiz.title}</CardTitle>
                  <p className='text-sm font-medium text-black/70 mt-1'>
                    Full-length exam simulation. At the end you&apos;ll see your scaled score,
                    whether you&apos;d pass, and which domains need work.
                  </p>
                </CardHeader>
                <CardContent className='py-4'>
                  <div className='flex gap-3 flex-wrap'>
                    {quiz.questionCount != null && (
                      <Badge
                        variant='outline'
                        className='border-2 border-black font-bold flex items-center gap-1'
                      >
                        <BookOpen className='h-3 w-3' />
                        {quiz.questionCount} Questions
                      </Badge>
                    )}
                    <Badge variant='outline' className='border-2 border-black font-bold'>
                      Scaled Score
                    </Badge>
                    <Badge variant='outline' className='border-2 border-black font-bold'>
                      Pass / Fail
                    </Badge>
                    <Badge variant='outline' className='border-2 border-black font-bold'>
                      Domain Breakdown
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className='border-t-2 border-black pt-4'>
                  <Button
                    className='w-full'
                    onClick={handleStartExam}
                    disabled={!email.trim() || isStartingExam}
                  >
                    {isStartingExam ? 'Starting...' : 'Start Exam'}
                    {!isStartingExam && <ArrowRight className='ml-2 h-4 w-4' />}
                  </Button>
                </CardFooter>
              </Card>
            </section>

            {/* Domain Practice Subquizzes */}
            {subquizzes.length > 0 && (
              <section className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-black' />
                  <h2 className='text-xl font-black text-black'>Domain Practice</h2>
                </div>
                <p className='text-sm text-black/70 font-medium -mt-2'>
                  15-question focused quizzes per domain. Fast feedback, no pass/fail pressure.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {subquizzes.map(sq => (
                    <SubquizCard
                      key={sq.id}
                      subquiz={sq}
                      email={email}
                      isStarting={startingSubquizId === sq.id}
                      onStart={() => handleStartSubquiz(sq)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className='text-center space-y-4'>
            <p className='font-bold text-black'>Quiz not found.</p>
            <Button variant='outline' asChild>
              <Link href='/dashboard'>Back to Dashboard</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function SubquizCard({
  subquiz,
  email,
  isStarting,
  onStart
}: {
  subquiz: SubquizDto;
  email: string;
  isStarting: boolean;
  onStart: () => void;
}) {
  const isDisabled = !subquiz.isAvailable;

  return (
    <Card
      className={`border-2 border-black ${
        isDisabled
          ? 'opacity-60 shadow-none bg-white/60'
          : 'shadow-[4px_4px_0px_0px_#000] bg-white'
      }`}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-base font-black text-black leading-tight'>
            {subquiz.title}
          </CardTitle>
          {isDisabled && <Lock className='h-4 w-4 text-black/40 shrink-0 mt-0.5' />}
        </div>
        <Badge
          variant='outline'
          className='border-2 border-black font-bold text-xs w-fit mt-1'
        >
          {subquiz.domain}
        </Badge>
      </CardHeader>
      <CardFooter className='pt-0'>
        <div className='flex items-center justify-between w-full'>
          <span className='text-xs font-bold text-black/50'>15 Questions</span>
          <Button
            size='sm'
            onClick={onStart}
            disabled={isDisabled || isStarting || !email.trim()}
          >
            {isStarting ? 'Starting...' : 'Practice'}
            {!isStarting && <ArrowRight className='ml-1 h-3 w-3' />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
