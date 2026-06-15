import { BookOpen } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { capitalize } from '@/lib/utils';

type CertificationCardProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  difficulty: string;
  questions: number;
  available?: boolean;
  href?: string;
};

export function CertificationCard({
  title,
  description,
  icon,
  difficulty,
  questions,
  available = false,
  href
}: CertificationCardProps) {
  return (
    <Card className='group relative flex flex-col gap-4 overflow-hidden transition-colors hover:border-primary'>
      <CardHeader className='gap-3 pb-0'>
        <div className='flex items-center justify-between'>
          <div className='flex h-12 w-12 items-center justify-center border border-primary bg-primary'>
            {icon}
          </div>
          {!available && <Badge variant='outline'>Soon</Badge>}
        </div>
        <CardTitle className='text-lg leading-tight text-balance'>
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className='text-balance'>
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className='flex-1' />
      <CardFooter className='flex flex-col gap-3 border-t border-border pt-4'>
        <div className='flex w-full items-center justify-between'>
          <Badge variant='outline'>{capitalize(difficulty)}</Badge>
          <span className='hud-label flex items-center gap-1.5 text-foreground'>
            <BookOpen className='h-3.5 w-3.5' />
            {questions} Q
          </span>
        </div>
        {available && href ? (
          <Button className='w-full' asChild>
            <Link href={href}>Start</Link>
          </Button>
        ) : (
          <Button className='w-full' disabled={!available} variant='outline'>
            Locked
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
