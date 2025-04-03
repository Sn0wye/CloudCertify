import { Cloud, Code, Database, Server } from 'lucide-react';

export const certifications = [
  {
    id: 'clf-c02',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    description:
      'Build your foundational understanding of AWS Cloud concepts, services, and terminology.',
    icon: <Cloud className='h-12 w-12 text-sky-500' />,
    difficulty: 'Foundational',
    questions: 1185,
    available: true,
    href: '/dashboard',
    progress: 0
  },
  {
    id: 'saa-c03',
    title: 'AWS Certified Solutions Architect (SAA-C03)',
    description:
      'Learn to design distributed systems and implement AWS solutions.',
    icon: <Server className='h-12 w-12 text-sky-500' />,
    difficulty: 'Associate',
    questions: 450,
    available: false,
    href: '/certifications/aws-solutions-architect-associate',
    progress: 0
  },
  {
    id: 'dva-c02',
    title: 'AWS Certified Developer (DVA-C02)',
    description:
      'Master developing, deploying, and debugging cloud-based applications.',
    icon: <Code className='h-12 w-12 text-sky-500' />,
    difficulty: 'Associate',
    questions: 380,
    available: false,
    href: '/certifications/aws-developer-associate',
    progress: 0
  },
  {
    id: 'soa-c02',
    title: 'AWS SysOps Administrator (SOA-C02)',
    description: 'Learn to deploy, manage, and operate systems on AWS.',
    icon: <Database className='h-12 w-12 text-sky-500' />,
    difficulty: 'Associate',
    questions: 420,
    available: false,
    href: '/certifications/aws-sysops-administrator',
    progress: 0
  }
];
