import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Lock, Target, Zap } from 'lucide-react';
import { Link, useLocation, useParams } from 'wouter';
import { toast } from 'sonner';
import { z } from 'zod';
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
import { SiteHeader } from '@/components/site-header';
import {
  postQuizQuizIdStart,
  postQuizQuizIdSubquizzesSubquizIdStart,
  useGetQuizQuizId
} from '@/http/generated/api';
import type { SubquizDto } from '@/http/generated/api.schemas';
import { getLucideIcon } from '@/lib/quiz-icon';
import { capitalize } from '@/lib/utils';

// --- Validation ---
const emailSchema = z.email('Please enter a valid email address.');

// --- Constants ---
const PROVIDER_LABELS: Record<string, string> = {
  aws: 'Amazon Web Services',
  gcp: 'Google Cloud',
  azure: 'Microsoft Azure'
};

const PROVIDER_QUESTION_COUNT: Record<string, string> = {
  aws: '65',
  azure: '40–60',
  gcp: '50'
};

// --- Page ---
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
    } catch {
      // ignore malformed session storage
    }
    return '';
  });
  const [emailError, setEmailError] = useState<string | null>(null);

  const [isStartingExam, setIsStartingExam] = useState(false);
  const [startingSubquizId, setStartingSubquizId] = useState<number | null>(
    null
  );

  const validateEmail = (): boolean => {
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? 'Invalid email.';
      setEmailError(msg);
      toast.error(msg);
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleStartExam = async () => {
    if (!validateEmail()) return;
    setIsStartingExam(true);
    try {
      const response = await postQuizQuizIdStart(quizId, {
        email: email.trim()
      });
      sessionStorage.setItem(
        `quiz-session-${quizId}`,
        JSON.stringify({ quizDetail: response.data, email: email.trim() })
      );
      navigate(`/quiz/${quizId}/session`);
    } catch {
      toast.error('Failed to start the exam. Please try again.');
    } finally {
      setIsStartingExam(false);
    }
  };

  const handleStartSubquiz = async (subquiz: SubquizDto) => {
    if (!validateEmail()) return;
    setStartingSubquizId(subquiz.id);
    try {
      const response = await postQuizQuizIdSubquizzesSubquizIdStart(
        quizId,
        subquiz.id,
        {
          email: email.trim()
        }
      );
      sessionStorage.setItem(
        `subquiz-session-${quizId}-${subquiz.id}`,
        JSON.stringify({ subquizDetail: response.data, email: email.trim() })
      );
      navigate(`/quiz/${quizId}/subquiz/${subquiz.id}/session`);
    } catch {
      toast.error('Failed to start the practice. Please try again.');
    } finally {
      setStartingSubquizId(null);
    }
  };

  const subquizzes = quiz?.subQuizzes ?? [];
  const providerQuestionCount = quiz?.quizProvider
    ? (PROVIDER_QUESTION_COUNT[quiz.quizProvider] ?? null)
    : null;

  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <SiteHeader>
        <Button variant='outline' size='sm' asChild>
          <Link href='/dashboard'>
            <ArrowLeft className='h-4 w-4' />
            Dashboard
          </Link>
        </Button>
      </SiteHeader>

      <main className='container mx-auto max-w-3xl flex-1 space-y-10 py-12'>
        {isLoading ? (
          <div className='h-64 animate-pulse border border-border bg-card' />
        ) : quiz ? (
          <>
            {/* Certification header */}
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='flex h-20 w-20 items-center justify-center border border-primary bg-primary'>
                {getLucideIcon(quiz.iconName, {
                  className: 'h-10 w-10 text-primary-foreground'
                })}
              </div>
              <h1 className='font-display text-3xl uppercase tracking-tight text-foreground text-balance md:text-4xl'>
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className='max-w-xl text-sm text-muted-foreground text-pretty'>
                  {quiz.description}
                </p>
              )}
              <div className='flex flex-wrap justify-center gap-2'>
                {quiz.quizProvider && (
                  <Badge variant='outline'>
                    {PROVIDER_LABELS[quiz.quizProvider] ??
                      quiz.quizProvider.toUpperCase()}
                  </Badge>
                )}
                {quiz.quizLevel && <Badge>{capitalize(quiz.quizLevel)}</Badge>}
              </div>
            </div>

            {/* Shared email input */}
            <div className='space-y-2'>
              <label htmlFor='email' className='hud-label block'>
                Operator email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                onBlur={() => {
                  if (email.trim()) {
                    const result = emailSchema.safeParse(email.trim());
                    if (!result.success) {
                      setEmailError(
                        result.error.issues[0]?.message ?? 'Invalid email.'
                      );
                    } else {
                      setEmailError(null);
                    }
                  }
                }}
                placeholder='you@example.com'
                className={`w-full border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none ${
                  emailError
                    ? 'border-destructive focus:border-destructive'
                    : 'border-input focus:border-primary'
                }`}
              />
              {emailError && (
                <p className='font-mono text-xs font-medium text-destructive'>
                  {emailError}
                </p>
              )}
            </div>

            {/* Full Simulation Exam */}
            <section className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Target className='h-5 w-5 text-primary' />
                <h2 className='font-display text-xl uppercase tracking-tight text-foreground'>
                  Full simulation exam
                </h2>
              </div>
              <Card className='gap-0'>
                <CardHeader className='gap-2 border-b border-border pb-4'>
                  <CardTitle className='text-lg'>{quiz.title}</CardTitle>
                  <p className='text-sm text-muted-foreground'>
                    Full-length exam simulation. At the end you&apos;ll see your
                    scaled score, whether you&apos;d pass, and which domains need
                    work.
                  </p>
                </CardHeader>
                <CardContent className='py-4'>
                  <div className='flex flex-wrap gap-2'>
                    {quiz.questionCount != null && (
                      <Badge variant='outline'>
                        <BookOpen className='h-3 w-3' />
                        {quiz.questionCount} in pool
                      </Badge>
                    )}
                    {providerQuestionCount && (
                      <Badge variant='outline'>
                        <Target className='h-3 w-3' />~{providerQuestionCount} per
                        exam
                      </Badge>
                    )}
                    <Badge variant='outline'>Scaled score</Badge>
                    <Badge variant='outline'>Pass / fail</Badge>
                    <Badge variant='outline'>Domain breakdown</Badge>
                  </div>
                </CardContent>
                <CardFooter className='border-t border-border pt-4'>
                  <Button
                    className='w-full'
                    onClick={handleStartExam}
                    disabled={isStartingExam}
                  >
                    {isStartingExam ? 'Starting...' : 'Start exam'}
                    {!isStartingExam && <ArrowRight className='h-4 w-4' />}
                  </Button>
                </CardFooter>
              </Card>
            </section>

            {/* Domain Practice Subquizzes */}
            {subquizzes.length > 0 && (
              <section className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-primary' />
                  <h2 className='font-display text-xl uppercase tracking-tight text-foreground'>
                    Domain practice
                  </h2>
                </div>
                <p className='-mt-2 text-sm text-muted-foreground'>
                  15-question focused drills per domain. Fast feedback, no
                  pass/fail pressure.
                </p>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {subquizzes.map(sq => (
                    <SubquizCard
                      key={sq.id}
                      subquiz={sq}
                      isStarting={startingSubquizId === sq.id}
                      onStart={() => handleStartSubquiz(sq)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className='space-y-4 text-center'>
            <p className='font-mono font-semibold text-foreground'>
              Quiz not found.
            </p>
            <Button variant='outline' asChild>
              <Link href='/dashboard'>Back to dashboard</Link>
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
  isStarting,
  onStart
}: {
  subquiz: SubquizDto;
  isStarting: boolean;
  onStart: () => void;
}) {
  const isUnavailable = !subquiz.isAvailable;

  return (
    <Card
      className={`gap-3 ${isUnavailable ? 'opacity-60' : 'transition-colors hover:border-primary'}`}
    >
      <CardHeader className='gap-2 pb-0'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-base leading-tight normal-case'>
            {subquiz.title}
          </CardTitle>
          {isUnavailable && (
            <Lock className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
          )}
        </div>
        <Badge variant='outline' className='mt-1'>
          {subquiz.domain}
        </Badge>
      </CardHeader>
      <CardFooter className='pt-0'>
        <div className='flex w-full items-center justify-between'>
          <span className='hud-label'>15 Q</span>
          <Button
            size='sm'
            onClick={onStart}
            disabled={isUnavailable || isStarting}
          >
            {isStarting ? 'Starting...' : 'Practice'}
            {!isStarting && <ArrowRight className='h-3 w-3' />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
