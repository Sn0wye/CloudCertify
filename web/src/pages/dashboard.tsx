'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { Footer } from '@/components/footer';
import { SiteHeader } from '@/components/site-header';
import { CertificationCard } from '@/components/certification-card';
import { useGetQuiz } from '@/http/generated/api';
import { getLucideIcon } from '@/lib/quiz-icon';

function SkeletonCard() {
  return (
    <Card className='h-56 animate-pulse overflow-hidden'>
      <div className='flex flex-1 flex-col gap-4 p-6'>
        <div className='h-12 w-12 bg-secondary' />
        <div className='h-4 w-3/4 bg-secondary' />
        <div className='h-3 w-full bg-secondary' />
        <div className='h-3 w-5/6 bg-secondary' />
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError } = useGetQuiz();
  const quizzes = data?.data ?? [];

  const availableQuizzes = quizzes.filter(q => q.isAvailable);
  const comingSoonQuizzes = quizzes.filter(q => !q.isAvailable);

  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <SiteHeader>
        <Button variant='outline' size='sm' asChild>
          <Link href='/'>
            <ArrowLeft className='h-4 w-4' />
            Home
          </Link>
        </Button>
      </SiteHeader>

      <main className='container flex-1 py-12'>
        <div className='flex flex-col gap-10'>
          <div className='border-b border-border pb-6'>
            <span className='hud-label text-primary'>[ CONTROL ]</span>
            <h1 className='mt-2 font-display text-4xl uppercase tracking-tight text-foreground'>
              Dashboard
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Continue your cloud certification journey.
            </p>
          </div>

          {isError && (
            <Card className='border-destructive p-8 text-center'>
              <p className='text-destructive'>
                Failed to load certifications. Please try again later.
              </p>
            </Card>
          )}

          {!isError && (
            <>
              <section className='space-y-5'>
                <div className='flex items-baseline gap-3'>
                  <h2 className='font-display text-xl uppercase tracking-tight text-foreground'>
                    Available
                  </h2>
                  <span className='hud-label'>
                    {isLoading ? '--' : availableQuizzes.length} units
                  </span>
                </div>

                {isLoading ? (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : availableQuizzes.length === 0 ? (
                  <Card className='p-8 text-center'>
                    <p className='text-muted-foreground'>
                      No certifications are currently available.
                    </p>
                  </Card>
                ) : (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {availableQuizzes.map(quiz => (
                      <CertificationCard
                        key={quiz.id}
                        title={quiz.title ?? ''}
                        description={quiz.description}
                        icon={getLucideIcon(quiz.iconName)}
                        difficulty={quiz.quizLevel ?? ''}
                        questions={quiz.questionCount ?? 0}
                        available={quiz.isAvailable}
                        href={`/quiz/${quiz.id}`}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className='space-y-5'>
                <div className='flex items-baseline gap-3'>
                  <h2 className='font-display text-xl uppercase tracking-tight text-foreground'>
                    Coming soon
                  </h2>
                  <span className='hud-label'>standby</span>
                </div>

                {isLoading ? (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : comingSoonQuizzes.length === 0 ? null : (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {comingSoonQuizzes.map(quiz => (
                      <CertificationCard
                        key={quiz.id}
                        title={quiz.title ?? ''}
                        description={quiz.description}
                        icon={getLucideIcon(quiz.iconName)}
                        difficulty={String(quiz.quizLevel ?? '')}
                        questions={quiz.questionCount ?? 0}
                        available={quiz.isAvailable}
                        href={`/quiz/${quiz.id}`}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
