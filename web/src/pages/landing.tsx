import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Cloud,
  Code,
  Database,
  Server
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <div className='flex gap-2 items-center text-xl font-bold'>
            <Cloud className='h-6 w-6 text-sky-500' />
            <span>CloudCertify</span>
          </div>
          <div className='flex flex-1 items-center justify-end'>
            <nav className='flex items-center space-x-6'>
              <a
                href='#'
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
              <a
                href='#'
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                About
              </a>
              <Button asChild size='sm'>
                <a href='#certifications'>Learn Now</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 bg-linear-to-b from-sky-50 to-white'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <Badge className='px-3 py-1 text-sm bg-sky-100 text-sky-800 hover:bg-sky-100'>
                  100% Free Forever - No Credit Card Required
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
                <Button size='lg' className='bg-sky-600 hover:bg-sky-700'>
                  Start Learning <ArrowRight className='ml-2 h-4 w-4' />
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
              <CertificationCard
                title='AWS Solutions Architect'
                description='Learn to design distributed systems and implement AWS solutions.'
                icon={<Server className='h-12 w-12 text-sky-500' />}
                difficulty='Associate'
                questions={450}
              />
              <CertificationCard
                title='AWS Developer'
                description='Master developing, deploying, and debugging cloud-based applications.'
                icon={<Code className='h-12 w-12 text-sky-500' />}
                difficulty='Associate'
                questions={380}
              />
              <CertificationCard
                title='AWS SysOps Administrator'
                description='Learn to deploy, manage, and operate systems on AWS.'
                icon={<Database className='h-12 w-12 text-sky-500' />}
                difficulty='Associate'
                questions={420}
              />
              <CertificationCard
                title='AWS Cloud Practitioner'
                description='Build your foundational understanding of AWS Cloud concepts.'
                icon={<Cloud className='h-12 w-12 text-sky-500' />}
                difficulty='Foundational'
                questions={300}
              />
              <CertificationCard
                title='AWS Security Specialty'
                description='Specialize in AWS security, identity, and compliance.'
                icon={<CheckCircle className='h-12 w-12 text-sky-500' />}
                difficulty='Specialty'
                questions={520}
              />
              <CertificationCard
                title='AWS Machine Learning'
                description='Master machine learning solutions on the AWS platform.'
                icon={<BookOpen className='h-12 w-12 text-sky-500' />}
                difficulty='Specialty'
                questions={480}
              />
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
                      100% Free Forever
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
                        Full access to all AWS Cloud Practitioner (CLF-C02)
                        practice questions
                      </span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
                      <span>Detailed explanations for every question</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
                      <span>Performance tracking and analytics</span>
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
                    size='lg'
                    className='w-full bg-sky-600 hover:bg-sky-700'
                  >
                    Start Learning Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='space-y-4'>
                <div className='inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-800'>
                  Why Choose CloudCertify
                </div>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Focused on AWS Cloud Practitioner Success
                </h2>
                <p className='text-muted-foreground md:text-xl'>
                  Our platform is specifically designed to help you pass the AWS
                  Certified Cloud Practitioner (CLF-C02) exam.
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
                        Questions aligned with the latest CLF-C02 exam
                        objectives and format.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <CheckCircle className='h-6 w-6 text-green-500 mt-1' />
                    <div>
                      <h3 className='font-bold'>Beginner-Friendly</h3>
                      <p className='text-muted-foreground'>
                        Designed for those new to AWS, with clear explanations
                        of fundamental concepts.
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
                        Join thousands of successful AWS Cloud Practitioners.
                      </p>
                    </div>
                    <div className='grid w-full gap-2'>
                      <Button size='lg' className='bg-sky-600 hover:bg-sky-700'>
                        Start Learning Now
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
      <footer className='w-full border-t py-6 md:py-0'>
        <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
          <div className='flex items-center gap-2 text-lg font-semibold'>
            <Cloud className='h-5 w-5 text-sky-500' />
            <p>CloudCertify</p>
          </div>
          <p className='text-center text-sm text-muted-foreground md:text-left'>
            &copy; {new Date().getFullYear()} CloudCertify. All rights reserved.
          </p>
          <div className='flex gap-4'>
            {/* <a
                href='#'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                Terms
              </a>
              <a
                href='#'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                Privacy
              </a> */}
            <a
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

type CertificationCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  difficulty: string;
  questions: number;
};

function CertificationCard({
  title,
  description,
  icon,
  difficulty,
  questions
}: CertificationCardProps) {
  return (
    <Card className='flex flex-col overflow-hidden transition-all hover:shadow-lg'>
      <CardHeader className='pb-0'>
        <div className='flex justify-center mb-4'>{icon}</div>
        <CardTitle className='text-xl'>{title}</CardTitle>
        <CardDescription className='mt-2'>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='flex justify-between text-sm text-muted-foreground mt-4'>
          <div className='flex items-center gap-1'>
            <Badge variant='outline'>{difficulty}</Badge>
          </div>
          <div className='flex items-center gap-1'>
            <BookOpen className='h-4 w-4' />
            <span>{questions} Questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className='w-full'>Start Learning</Button>
      </CardFooter>
    </Card>
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
        <Button variant='ghost' size='sm'>
          Explanation
        </Button>
        <Button variant='outline' size='sm'>
          Next Question
        </Button>
      </CardFooter>
    </Card>
  );
}
