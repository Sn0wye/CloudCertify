import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Cloud } from 'lucide-react';
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
import { postQuizQuizIdStart, useGetQuizQuizId } from '@/http/generated/api';
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

  const [email, setEmail] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!email.trim()) return;
    setIsStarting(true);
    setError(null);
    try {
      const response = await postQuizQuizIdStart(quizId, { email });
      sessionStorage.setItem(
        `quiz-session-${quizId}`,
        JSON.stringify({ quizDetail: response.data, email })
      );
      navigate(`/quiz/${quizId}/session`);
    } catch {
      setError('Failed to start quiz. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const levelColor =
    quiz?.quizLevel ? (LEVEL_COLORS[quiz.quizLevel] ?? 'bg-[#38bdf8]') : 'bg-[#38bdf8]';

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

      <main className='flex-1 container max-w-2xl mx-auto py-12 px-4'>
        {isLoading ? (
          <div className='h-64 animate-pulse rounded-[5px] border-2 border-dashed border-black bg-white' />
        ) : quiz ? (
          <Card className='w-full border-4 border-black shadow-[8px_8px_0px_0px_#000]'>
            <CardHeader className='border-b-2 border-black pb-6'>
              <div className='flex justify-center mb-6'>
                <div
                  className={`h-16 w-16 rounded-[5px] border-2 border-black ${levelColor} flex items-center justify-center shadow-[4px_4px_0px_0px_#000]`}
                >
                  {getLucideIcon(quiz.iconName, { className: 'h-8 w-8 text-black' })}
                </div>
              </div>
              <CardTitle className='text-2xl md:text-3xl font-black text-black text-center text-balance'>
                {quiz.title}
              </CardTitle>
              {quiz.description && (
                <p className='text-center text-black/70 font-medium mt-2'>
                  {quiz.description}
                </p>
              )}
              <div className='flex justify-center gap-3 mt-4 flex-wrap'>
                {quiz.quizProvider && (
                  <Badge className='bg-[#38bdf8] border-2 border-black text-black font-bold'>
                    {PROVIDER_LABELS[quiz.quizProvider] ?? quiz.quizProvider.toUpperCase()}
                  </Badge>
                )}
                {quiz.quizLevel && (
                  <Badge className={`${levelColor} border-2 border-black text-black font-bold`}>
                    {capitalize(quiz.quizLevel)}
                  </Badge>
                )}
                {quiz.questionCount != null && (
                  <Badge
                    variant='outline'
                    className='border-2 border-black text-black font-bold flex items-center gap-1'
                  >
                    <BookOpen className='h-3 w-3' />
                    {quiz.questionCount} Questions
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className='py-8 space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='email' className='block text-sm font-black text-black'>
                  Enter your email to start
                </label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                  placeholder='you@example.com'
                  className='w-full rounded-[5px] border-2 border-black px-4 py-3 text-black font-medium placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] bg-white shadow-[2px_2px_0px_0px_#000]'
                  required
                />
                {error && (
                  <p className='text-sm font-bold text-[#ff4757]'>{error}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className='border-t-2 border-black pt-6'>
              <Button
                className='w-full'
                onClick={handleStart}
                disabled={!email.trim() || isStarting}
              >
                {isStarting ? 'Starting...' : 'Start Quiz'}
                {!isStarting && <ArrowRight className='ml-2 h-4 w-4' />}
              </Button>
            </CardFooter>
          </Card>
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
