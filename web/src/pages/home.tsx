'use client';
import { ArrowLeft, ArrowRight, Award, CheckCircle, Cloud } from 'lucide-react';
import RotatingText from '@/components/RotatingText';

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
import { CertificationRoadmap } from '@/components/certification-roadmap';
import { Link } from 'wouter';
import { useGetQuiz } from '@/http/generated/api';

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
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-black flex flex-wrap items-center justify-center gap-x-3'>
                  <span>Master</span>
                  <RotatingText
                    texts={['AWS', 'GCP', 'Azure']}
                    mainClassName='bg-transparent text-sky-500 overflow-hidden'
                    splitLevelClassName='overflow-hidden px-2'
                    staggerFrom='last'
                    staggerDuration={0.025}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-120%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    splitBy='characters'
                    auto
                    loop
                  />
                  <span>Certifications with Confidence</span>
                </h1>
                <p className='mx-auto max-w-175 text-muted-foreground md:text-xl'>
                  Interactive quizzes and practice exams designed to help you
                  ace your AWS, GCP, and Azure certification exams.
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

        <section
          className='w-full py-12 md:py-24 lg:py-32 relative overflow-hidden'
          id='certifications'
        >
          {/* Subtle dot grid background */}
          <div
            aria-hidden='true'
            className='absolute inset-0 -z-10 opacity-[0.4] [background-image:radial-gradient(circle,theme(colors.sky.200)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]'
          />
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
              <Badge className='px-3 py-1 text-sm bg-sky-100 text-sky-800 hover:bg-sky-100'>
                Visual Roadmap
              </Badge>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl text-balance'>
                  Plan your cloud certification journey
                </h2>
                <p className='mx-auto max-w-175 text-muted-foreground md:text-xl text-pretty'>
                  Follow the path from foundational to specialty. Each tier
                  builds on the last, just like the official AWS guidance.
                </p>
              </div>
            </div>
            <CertificationRoadmap quizzes={quizzes} isLoading={isLoading} />
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32 bg-sky-50'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Sample Quiz Questions
                </h2>
                <p className='mx-auto max-w-175 text-muted-foreground md:text-xl'>
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
                category='AWS Solutions Architect'
                difficulty='Medium'
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
                category='AWS Developer'
                difficulty='Medium'
              />
              <QuizCard
                question='Which Google Cloud service is used to store unstructured objects, similar to Amazon S3?'
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
                question='Which Azure service provides serverless compute to run event-driven code without managing infrastructure?'
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

        <section className='w-full py-12 md:py-24 lg:py-32' id='pricing'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Simple Pricing
                </h2>
                <p className='mx-auto max-w-175 text-muted-foreground md:text-xl'>
                  No subscriptions. No premium tiers. Just free cloud
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
                      <span>
                        Full access to all AWS, GCP, and Azure practice
                        questions
                      </span>
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
                  Focused on Cloud Certification Success
                </h2>
                <p className='text-muted-foreground md:text-xl'>
                  Designed to help you pass certification exams across AWS,
                  Google Cloud, and Azure.
                </p>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4'>
                    <CheckCircle className='h-6 w-6 text-green-500 mt-1' />
                    <div>
                      <h3 className='font-bold'>Multi-Cloud Question Bank</h3>
                      <p className='text-muted-foreground'>
                        Hundreds of practice questions covering AWS, Google
                        Cloud, and Azure certification exams.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <CheckCircle className='h-6 w-6 text-green-500 mt-1' />
                    <div>
                      <h3 className='font-bold'>Cloud Concepts Coverage</h3>
                      <p className='text-muted-foreground'>
                        Comprehensive coverage of cloud concepts, services,
                        security, and pricing models across all three major
                        providers.
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
                        Ready to get cloud certified?
                      </h3>
                      <p className='text-muted-foreground'>
                        Take the first step towards your AWS, GCP, or Azure
                        certification today.
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
