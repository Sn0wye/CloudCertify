'use client';
import { ArrowRight, Check, Cloud, Crosshair, Target } from 'lucide-react';
import RotatingText from '@/components/RotatingText';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/footer';
import { SiteHeader } from '@/components/site-header';
import { CertificationRoadmap } from '@/components/certification-roadmap';
import { Link } from 'wouter';
import { useGetQuiz } from '@/http/generated/api';

export function HomePage() {
  const { data, isLoading } = useGetQuiz();
  const quizzes = data?.data ?? [];

  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <SiteHeader>
        <nav className='flex items-center gap-6'>
          <a href='#features' className='hud-label hidden hover:text-primary sm:inline'>
            Features
          </a>
          <a href='#pricing' className='hud-label hidden hover:text-primary sm:inline'>
            Pricing
          </a>
          <Button asChild size='sm'>
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
        </nav>
      </SiteHeader>

      <main className='flex-1'>
        {/* HERO */}
        <section
          id='hero'
          className='relative w-full overflow-hidden border-b border-border'
        >
          {/* blueprint grid backdrop */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 opacity-[0.05]'
            style={{
              backgroundImage:
                'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />
          <div className='container relative py-20 md:py-28 lg:py-36'>
            <div className='flex items-center justify-between border-b border-border pb-4'>
              <span className='hud-label flex items-center gap-2'>
                <Crosshair className='h-3.5 w-3.5 text-primary' />
                SYS://CERTIFICATION-TRAINER
              </span>
              <span className='hud-label'>
                <span className='text-success blink'>●</span> ONLINE · REV 2.1
              </span>
            </div>

            <div className='grid items-end gap-10 pt-10 lg:grid-cols-[1.4fr_1fr]'>
              <div>
                <h1 className='font-display text-[clamp(2.75rem,9vw,7rem)] uppercase leading-[0.9] tracking-[-0.03em] text-foreground'>
                  Master
                  <br />
                  <span className='inline-flex items-baseline gap-3'>
                    <span className='bg-primary px-3 py-1 text-primary-foreground'>
                      <RotatingText
                        texts={['AWS', 'GCP', 'AZURE']}
                        mainClassName='text-primary-foreground'
                        splitLevelClassName='overflow-hidden'
                        staggerFrom='last'
                        staggerDuration={0.025}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-120%' }}
                        transition={{
                          type: 'spring',
                          damping: 30,
                          stiffness: 400
                        }}
                        rotationInterval={2000}
                        splitBy='characters'
                        auto
                        loop
                      />
                    </span>
                  </span>
                  <br />
                  Certs
                </h1>
              </div>

              <div className='space-y-6 lg:pb-4'>
                <p className='max-w-md font-mono text-base leading-relaxed text-muted-foreground'>
                  <span className='text-primary'>&gt;</span> Interactive practice
                  exams and domain drills built to get you through the AWS, GCP
                  and Azure certification gauntlet.
                </p>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Button asChild size='lg'>
                    <Link href='/dashboard'>
                      Start drills <ArrowRight className='h-4 w-4' />
                    </Link>
                  </Button>
                  <Button size='lg' variant='outline' asChild>
                    <a href='#certifications'>View paths</a>
                  </Button>
                </div>
                <Badge variant='secondary'>100% free · no account</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATION PATHS */}
        <section
          id='certifications'
          className='w-full border-b border-border py-20 md:py-28'
        >
          <div className='container'>
            <SectionHeading index='01' title='Pick your path' />
            <CertificationRoadmap quizzes={quizzes} isLoading={isLoading} />
          </div>
        </section>

        {/* SAMPLE QUESTIONS */}
        <section className='w-full border-b border-border py-20 md:py-28'>
          <div className='container'>
            <SectionHeading
              index='02'
              title='Sample questions'
              note='A taste of the drill format.'
            />
            <div className='mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2'>
              <QuizCard
                question='Which AWS service runs containers without managing servers or clusters?'
                options={['Amazon ECS', 'Amazon EKS', 'AWS Fargate', 'AWS Lambda']}
                correctAnswer={2}
                category='AWS Solutions Architect'
                difficulty='Medium'
              />
              <QuizCard
                question='Which AWS service runs code without provisioning or managing servers?'
                options={[
                  'AWS Elastic Beanstalk',
                  'Amazon EC2',
                  'AWS Lambda',
                  'Amazon ECS'
                ]}
                correctAnswer={2}
                category='AWS Developer'
                difficulty='Medium'
              />
              <QuizCard
                question='Which Google Cloud service stores unstructured objects, similar to Amazon S3?'
                options={[
                  'Cloud Filestore',
                  'Cloud SQL',
                  'Cloud Storage',
                  'Persistent Disk'
                ]}
                correctAnswer={2}
                category='Google Cloud'
                difficulty='Easy'
              />
              <QuizCard
                question='Which Azure service provides serverless compute for event-driven code?'
                options={[
                  'Azure App Service',
                  'Azure Functions',
                  'Azure Logic Apps',
                  'Azure Container Instances'
                ]}
                correctAnswer={1}
                category='Azure'
                difficulty='Easy'
              />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id='pricing'
          className='w-full border-b border-border py-20 md:py-28'
        >
          <div className='container'>
            <SectionHeading
              index='03'
              title='Pricing'
              note='No subscriptions. No tiers. Just free training.'
            />
            <div className='mx-auto mt-10 max-w-md'>
              <Card className='gap-0 border-border'>
                <CardHeader className='items-center gap-2 border-b border-border pb-6 text-center'>
                  <span className='hud-label'>Access cost</span>
                  <span className='font-display text-7xl text-primary'>$0</span>
                  <p className='text-sm text-muted-foreground'>
                    Forever free. No catches.
                  </p>
                </CardHeader>
                <CardContent className='py-6'>
                  <ul className='space-y-3'>
                    {[
                      'All AWS, GCP and Azure questions',
                      'Full exam simulation mode',
                      'Per-domain practice drills',
                      'No credit card, no account'
                    ].map(item => (
                      <li key={item} className='flex items-center gap-3'>
                        <Check className='h-4 w-4 shrink-0 text-success' />
                        <span className='text-sm text-foreground'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className='border-t border-border pt-6'>
                  <Button asChild size='lg' className='w-full'>
                    <Link href='/dashboard'>Start learning</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id='features' className='w-full py-20 md:py-28'>
          <div className='container grid items-start gap-12 lg:grid-cols-2'>
            <div className='space-y-6'>
              <SectionHeading index='04' title='Built for one job' />
              <p className='max-w-md font-mono text-base leading-relaxed text-muted-foreground'>
                Pass certification exams across AWS, Google Cloud and Azure.
                Nothing else in the way.
              </p>
              <dl className='divide-y divide-border border-y border-border'>
                {FEATURES.map(f => (
                  <div key={f.title} className='flex gap-4 py-5'>
                    <span className='hud-label pt-1 text-primary'>{f.id}</span>
                    <div>
                      <dt className='font-display text-base uppercase tracking-tight text-foreground'>
                        {f.title}
                      </dt>
                      <dd className='mt-1 text-sm text-muted-foreground'>
                        {f.body}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className='border border-border bg-card p-8 lg:sticky lg:top-24'>
              <div className='flex items-center justify-between border-b border-border pb-4'>
                <span className='hud-label'>Unit / D-01</span>
                <Target className='h-4 w-4 text-primary' />
              </div>
              <div className='flex flex-col items-center gap-6 py-12 text-center'>
                <div className='flex h-20 w-20 items-center justify-center border border-primary bg-primary'>
                  <Cloud className='h-10 w-10 text-primary-foreground' />
                </div>
                <h3 className='font-display text-2xl uppercase tracking-tight text-foreground'>
                  Ready to get certified?
                </h3>
                <p className='max-w-xs text-sm text-muted-foreground'>
                  Take the first step toward your AWS, GCP or Azure credential.
                </p>
                <Button asChild size='lg' className='w-full'>
                  <Link href='/dashboard'>Start learning</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const FEATURES = [
  {
    id: 'A',
    title: 'Multi-cloud question bank',
    body: 'Hundreds of practice questions across AWS, Google Cloud and Azure exam objectives.'
  },
  {
    id: 'B',
    title: 'Full concept coverage',
    body: 'Services, security, networking and pricing models across all three major providers.'
  },
  {
    id: 'C',
    title: 'Exam-aligned drills',
    body: 'Questions matched to the latest exam objectives and answer formats.'
  }
];

function SectionHeading({
  index,
  title,
  note
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <div className='mb-10 flex flex-col gap-2 border-b border-border pb-6'>
      <span className='hud-label text-primary'>[ {index} ]</span>
      <h2 className='font-display text-3xl uppercase tracking-tight text-foreground md:text-4xl'>
        {title}
      </h2>
      {note && <p className='text-sm text-muted-foreground'>{note}</p>}
    </div>
  );
}

type QuizCardProps = {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
};

function QuizCard({
  question,
  options,
  correctAnswer,
  category,
  difficulty
}: QuizCardProps) {
  return (
    <Card className='gap-0 py-0'>
      <CardHeader className='gap-3 border-b border-border py-4'>
        <div className='flex items-center justify-between'>
          <Badge variant='outline'>{category}</Badge>
          <Badge
            variant={
              difficulty === 'Easy'
                ? 'outline'
                : difficulty === 'Medium'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {difficulty}
          </Badge>
        </div>
        <p className='font-mono text-sm font-medium leading-relaxed text-foreground'>
          {question}
        </p>
      </CardHeader>
      <CardContent className='space-y-2 py-4'>
        {options.map((option, index) => {
          const correct = index === correctAnswer;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 border px-3 py-2.5 text-sm transition-colors ${
                correct
                  ? 'border-success bg-success/10 text-foreground'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-[11px] ${
                  correct
                    ? 'border-success bg-success text-success-foreground'
                    : 'border-border-strong text-muted-foreground'
                }`}
              >
                {correct ? <Check className='h-3 w-3' /> : String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
