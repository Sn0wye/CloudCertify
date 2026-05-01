'use client';
import { ArrowLeft, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { Footer } from '@/components/footer';
import { CertificationCard } from '@/components/certification-card';
import { useGetQuiz } from '@/http/generated/api';
import { getLucideIcon } from '@/lib/quiz-icon';

function SkeletonCard() {
  return (
    <Card className='flex flex-col overflow-hidden h-56 animate-pulse'>
      <div className='flex-1 p-6 flex flex-col gap-4'>
        <div className='w-12 h-12 rounded-full bg-muted mx-auto' />
        <div className='h-4 bg-muted rounded w-3/4 mx-auto' />
        <div className='h-3 bg-muted rounded w-full' />
        <div className='h-3 bg-muted rounded w-5/6' />
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
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <Link href='/' className='flex gap-2 items-center text-xl font-bold'>
            <Cloud className='h-6 w-6 text-sky-500' />
            <span>CloudCertify</span>
          </Link>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 container py-8'>
        <div className='flex flex-col gap-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              Continue your cloud certification journey
            </p>
          </div>

          {isError && (
            <Card className='p-8 text-center'>
              <p className='text-muted-foreground'>
                Failed to load certifications. Please try again later.
              </p>
            </Card>
          )}

          {!isError && (
            <>
              <section>
                <h2 className='text-xl font-semibold mb-4'>
                  Available Certifications
                </h2>

                {isLoading ? (
                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
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

              <section className='mt-8'>
                <h2 className='text-xl font-semibold mb-4'>Coming Soon</h2>

                {isLoading ? (
                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : comingSoonQuizzes.length === 0 ? null : (
                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
