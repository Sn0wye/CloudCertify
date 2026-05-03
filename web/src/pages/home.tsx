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
    <div className='flex min-h-screen flex-col bg-[#dfe5f2]'>
      <header className='sticky top-0 z-50 w-full border-b-2 border-black bg-white'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <Link href='/' className='flex gap-2 items-center text-xl font-black'>
            <div className='h-10 w-10 rounded-[5px] border-2 border-black bg-[#38bdf8] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]'>
              <Cloud className='h-5 w-5 text-black' />
            </div>
            <span>CloudCertify</span>
          </Link>
          <div className='flex flex-1 items-center justify-end'>
            <nav className='flex items-center space-x-6'>
              <a
                href='#features'
                className='text-sm font-bold text-black transition-colors hover:underline'
              >
                Features
              </a>
              <a
                href='#pricing'
                className='text-sm font-bold text-black transition-colors hover:underline'
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
          className='w-full py-12 md:py-24 lg:py-32 bg-white border-b-2 border-black'
          id='hero'
        >
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-6 text-center'>
              <div className='space-y-4'>
                <Badge className='bg-[#38bdf8]'>
                  100% Free - No Credit Card Required
                </Badge>
                <h1 className='mx-auto max-w-4xl text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-black text-balance'>
                  <span className='inline-flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1'>
                    <span>Master</span>
                    <span className='inline-block rounded-[5px] border-2 border-black bg-[#38bdf8] px-3 shadow-[4px_4px_0px_0px_#000]'>
                      <RotatingText
                        texts={['AWS', 'GCP', 'Azure']}
                        mainClassName='text-black'
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
                    <span>Certifications</span>
                  </span>{' '}
                  <span className='block mt-2'>with Confidence</span>
                </h1>
                <p className='mx-auto max-w-175 text-black/80 md:text-xl font-medium'>
                  Interactive quizzes and practice exams designed to help you
                  ace your AWS, GCP, and Azure certification exams.
                </p>
              </div>
              <div className='flex flex-col gap-3 min-[400px]:flex-row'>
                <Button asChild size='lg'>
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
          className='w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-[#f0f9ff]'
          id='certifications'
        >
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center text-center mb-10'>
              <h2 className='text-3xl font-black tracking-tight md:text-4xl text-balance text-black'>
                Pick your path
              </h2>
            </div>
            <CertificationRoadmap quizzes={quizzes} isLoading={isLoading} />
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32 bg-[#38bdf8]'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-black tracking-tight md:text-4xl text-black'>
                  Sample Quiz Questions
                </h2>
                <p className='mx-auto max-w-175 text-black/80 md:text-xl font-medium'>
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

        <section className='w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]' id='pricing'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-black tracking-tight md:text-4xl text-black'>
                  Simple Pricing
                </h2>
                <p className='mx-auto max-w-175 text-black/70 md:text-xl font-medium'>
                  No subscriptions. No premium tiers. Just free cloud
                  certification training.
                </p>
              </div>
            </div>
            <div className='mx-auto max-w-md mt-8'>
              <Card className='overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#000]'>
                <CardHeader className='bg-[#38bdf8] pb-8 border-b-2 border-black'>
                  <div className='flex justify-center'>
                    <Badge className='text-lg bg-white'>
                      100% Free
                    </Badge>
                  </div>
                  <div className='flex justify-center mt-4'>
                    <div className='flex items-baseline'>
                      <span className='text-6xl font-black text-black'>$0</span>
                      <span className='text-black/70 ml-1 font-bold'>/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='p-6 bg-white'>
                  <ul className='space-y-4'>
                    <li className='flex items-start gap-3'>
                      <div className='h-6 w-6 rounded-[5px] border-2 border-black bg-[#1dd1a1] flex items-center justify-center'>
                        <CheckCircle className='h-4 w-4 text-black' />
                      </div>
                      <span className='font-medium text-black'>
                        Full access to all AWS, GCP, and Azure practice
                        questions
                      </span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <div className='h-6 w-6 rounded-[5px] border-2 border-black bg-[#1dd1a1] flex items-center justify-center'>
                        <CheckCircle className='h-4 w-4 text-black' />
                      </div>
                      <span className='font-medium text-black'>Exam simulation mode</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <div className='h-6 w-6 rounded-[5px] border-2 border-black bg-[#1dd1a1] flex items-center justify-center'>
                        <CheckCircle className='h-4 w-4 text-black' />
                      </div>
                      <span className='font-medium text-black'>No credit card required</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className='bg-[#e0f2fe] p-6 border-t-2 border-black'>
                  <Button asChild size='lg' className='w-full'>
                    <Link href='/dashboard'>Start Learning Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32 bg-white border-t-2 border-black' id='features'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='space-y-6'>
                <Badge>
                  Why Choose CloudCertify
                </Badge>
                <h2 className='text-3xl font-black tracking-tight md:text-4xl text-black'>
                  Focused on Cloud Certification Success
                </h2>
                <p className='text-black/70 md:text-xl font-medium'>
                  Designed to help you pass certification exams across AWS,
                  Google Cloud, and Azure.
                </p>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4 p-4 rounded-[5px] border-2 border-black bg-[#f0f9ff] shadow-[4px_4px_0px_0px_#000]'>
                    <div className='h-8 w-8 rounded-[5px] border-2 border-black bg-[#1dd1a1] flex items-center justify-center shrink-0'>
                      <CheckCircle className='h-5 w-5 text-black' />
                    </div>
                    <div>
                      <h3 className='font-black text-black'>Multi-Cloud Question Bank</h3>
                      <p className='text-black/70 font-medium'>
                        Hundreds of practice questions covering AWS, Google
                        Cloud, and Azure certification exams.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 rounded-[5px] border-2 border-black bg-[#f0f9ff] shadow-[4px_4px_0px_0px_#000]'>
                    <div className='h-8 w-8 rounded-[5px] border-2 border-black bg-[#1dd1a1] flex items-center justify-center shrink-0'>
                      <CheckCircle className='h-5 w-5 text-black' />
                    </div>
                    <div>
                      <h3 className='font-black text-black'>Cloud Concepts Coverage</h3>
                      <p className='text-black/70 font-medium'>
                        Comprehensive coverage of cloud concepts, services,
                        security, and pricing models across all three major
                        providers.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 rounded-[5px] border-2 border-black bg-[#f0f9ff] shadow-[4px_4px_0px_0px_#000]'>
                    <div className='h-8 w-8 rounded-[5px] border-2 border-black bg-[#1dd1a1] flex items-center justify-center shrink-0'>
                      <CheckCircle className='h-5 w-5 text-black' />
                    </div>
                    <div>
                      <h3 className='font-black text-black'>Exam-Focused Learning</h3>
                      <p className='text-black/70 font-medium'>
                        Questions aligned with the latest exam objectives and
                        format.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-center'>
                <div className='relative w-full max-w-md overflow-hidden rounded-[5px] border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_#000]'>
                  <div className='bg-[#38bdf8] rounded-[5px] border-2 border-black p-8 flex flex-col items-center justify-center space-y-6'>
                    <div className='h-20 w-20 rounded-[5px] border-2 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000]'>
                      <Award className='h-10 w-10 text-black' />
                    </div>
                    <div className='text-center space-y-2'>
                      <h3 className='text-2xl font-black text-black'>
                        Ready to get cloud certified?
                      </h3>
                      <p className='text-black/80 font-medium'>
                        Take the first step towards your AWS, GCP, or Azure
                        certification today.
                      </p>
                    </div>
                    <Button asChild size='lg' variant='secondary' className='w-full'>
                      <Link href='/dashboard'>Start Learning Now</Link>
                    </Button>
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
    <Card className='overflow-hidden bg-white'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between mb-2'>
          <Badge variant='outline'>
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
              className={`p-3 rounded-[5px] border-2 border-black font-medium ${
                index === correctAnswer
                  ? 'bg-[#1dd1a1] shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white'
              } flex items-start gap-2`}
            >
              <div
                className={`w-6 h-6 rounded-[5px] flex items-center justify-center border-2 border-black mt-0.5 ${
                  index === correctAnswer
                    ? 'bg-black text-white'
                    : 'bg-white'
                }`}
              >
                {index === correctAnswer && <CheckCircle className='h-4 w-4' />}
              </div>
              <span className='text-black'>{option}</span>
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
