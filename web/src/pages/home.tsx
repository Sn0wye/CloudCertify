'use client';
import { ArrowLeft, ArrowRight, Award, CheckCircle, Cloud } from 'lucide-react';

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
import { CertificationCard } from '@/components/certification-card';
import { Link } from 'wouter';
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

export function HomePage() {
  const { data, isLoading } = useGetQuiz();
  const quizzes = data?.data ?? [];

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <Link href='/' className='flex gap-2 items-center text-xl font-bold'>
            <Cloud className='h-6 w-6 text-sky-500' />
            <span>CloudCertify</span>
          </Link>
          <div className='flex flex-1 items-center justify-end'>
            <nav className='flex items-center space-x-6'>
              <a
                href='#features'
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                Features
              </a>
              <a
                href='#pricing'
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                Pricing
              </a>
              <Button asChild size='sm'>
                <a href='/dashboard'>Dashboard</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className='flex-1'>
        <section
          className='w-full py-12 md:py-24 lg:py-32 bg-linear-to-b from-sky-50 to-white'
          id='hero'
        >
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <Badge className='px-3 py-1 text-sm bg-sky-100 text-sky-800 hover:bg-sky-100'>
                  100% Free - No Credit Card Required
                </Badge>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-black'>
                  Master AWS Certifications with Confidence
                </h1>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  Interactive quizzes and practice exams designed to help you
                  ace your AWS certification exams.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button
                  asChild
                  size='lg'
                  className='bg-sky-600 hover:bg-sky-700'
                >
                  <Link href='/dashboard'>
                    Start Learning <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button size='lg' variant='outline' asChild>
                  <a href='#certifications'>View Certifications</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32' id='certifications'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  AWS Certification Paths
                </h2>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  Choose your certification path and start your cloud journey
                  today.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8'>
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                quizzes.map(quiz => (
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
                ))
              )}
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32 bg-sky-50'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Sample Quiz Questions
                </h2>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  Get a taste of our interactive quizzes designed to test your
                  knowledge.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-8'>
              <QuizCard
                question='Which AWS service would you use to run containers without managing servers or clusters?'
                options={[
                  'Amazon ECS',
                  'Amazon EKS',
                  'AWS Fargate',
                  'AWS Lambda'
                ]}
                correctAnswer={2}
                category='Solutions Architect'
                difficulty='Medium'
              />
              <QuizCard
                question='Which AWS service provides a virtual network dedicated to your AWS account?'
                options={[
                  'Amazon VPC',
                  'AWS Direct Connect',
                  'Amazon Route 53',
                  'AWS Transit Gateway'
                ]}
                correctAnswer={0}
                category='Cloud Practitioner'
                difficulty='Easy'
              />
              <QuizCard
                question='Which service would you use to store objects, with 99.999999999% durability?'
                options={[
                  'Amazon EBS',
                  'Amazon S3',
                  'Amazon EFS',
                  'AWS Storage Gateway'
                ]}
                correctAnswer={1}
                category='Developer'
                difficulty='Easy'
              />
              <QuizCard
                question='Which AWS service allows you to run code without provisioning or managing servers?'
                options={[
                  'AWS Elastic Beanstalk',
                  'Amazon EC2',
                  'AWS Lambda',
                  'Amazon ECS'
                ]}
                correctAnswer={2}
                category='Developer'
                difficulty='Medium'
              />
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32' id='pricing'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Simple Pricing
                </h2>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  No subscriptions. No premium tiers. Just free AWS
                  certification training.
                </p>
              </div>
            </div>
            <div className='mx-auto max-w-md mt-8'>
              <Card className='overflow-hidden border-2 border-sky-500'>
                <CardHeader className='bg-sky-50 pb-8'>
                  <div className='flex justify-center'>
                    <Badge className='px-3 py-1 text-lg font-bold bg-sky-100 text-sky-800'>
                      100% Free
                    </Badge>
                  </div>
                  <div className='flex justify-center mt-4'>
                    <div className='flex items-baseline'>
                      <span className='text-5xl font-bold'>$0</span>
                      <span className='text-muted-foreground ml-1'>/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='p-6'>
                  <ul className='space-y-4'>
                    <li className='flex items-start gap-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
                      <span>Full access to all AWS practice questions</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
                      <span>Exam simulation mode</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
                      <span>No credit card required</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className='bg-sky-50 p-6'>
                  <Button
                    asChild
                    size='lg'
                    className='w-full bg-sky-600 hover:bg-sky-700'
                  >
                    <Link href='/dashboard'>Start Learning Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32' id='features'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='space-y-4'>
                <div className='inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-800'>
                  Why Choose CloudCertify
                </div>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Focused on AWS Certification Success
                </h2>
                <p className='text-muted-foreground md:text-xl'>
                  This website is specifically designed to help you pass the AWS
                  certification exams
                </p>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4'>
                    <CheckCircle className='h-6 w-6 text-green-500 mt-1' />
                    <div>
                      <h3 className='font-bold'>CLF-C02 Question Bank</h3>
                      <p className='text-muted-foreground'>
                        Over 500 practice questions covering all domains of the
                        AWS Cloud Practitioner exam.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <CheckCircle className='h-6 w-6 text-green-500 mt-1' />
                    <div>
                      <h3 className='font-bold'>Cloud Concepts Coverage</h3>
                      <p className='text-muted-foreground'>
                        Comprehensive coverage of cloud concepts, AWS services,
                        security, and pricing models.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <CheckCircle className='h-6 w-6 text-green-500 mt-1' />
                    <div>
                      <h3 className='font-bold'>Exam-Focused Learning</h3>
                      <p className='text-muted-foreground'>
                        Questions aligned with the latest exam objectives and
                        format.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-center'>
                <div className='relative w-full max-w-md overflow-hidden rounded-xl border bg-background p-2 shadow-xl'>
                  <div className='bg-sky-50 rounded-lg p-8 flex flex-col items-center justify-center space-y-6'>
                    <Award className='h-16 w-16 text-sky-500' />
                    <div className='text-center space-y-2'>
                      <h3 className='text-2xl font-bold text-black'>
                        Ready to become AWS certified?
                      </h3>
                      <p className='text-muted-foreground'>
                        Take the first step towards your AWS certification
                        success today.
                      </p>
                    </div>
                    <div className='grid w-full gap-2'>
                      <Button
                        asChild
                        size='lg'
                        className='bg-sky-600 hover:bg-sky-700'
                      >
                        <Link href='/dashboard'>Start Learning Now</Link>
                      </Button>
                      <Button size='lg' variant='outline' asChild>
                        <a href='#pricing'>See Our Free Plan</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
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
    <Card className='overflow-hidden'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between mb-2'>
          <Badge variant='outline' className='bg-sky-50'>
            {category}
          </Badge>
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
        <CardTitle className='text-lg'>{question}</CardTitle>
      </CardHeader>
      <CardContent className='pb-2'>
        <div className='space-y-2'>
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border ${
                index === correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : 'border-input'
              } flex items-start gap-2`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  index === correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'border border-input'
                }`}
              >
                {index === correctAnswer && <CheckCircle className='h-4 w-4' />}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Previous
        </Button>

        <Button>
          Next
          <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  );
}
