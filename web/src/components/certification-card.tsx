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
    <Card className='flex flex-col overflow-hidden transition-all hover:shadow-lg relative'>
      {!available && (
        <div className='absolute top-0 right-0 m-3'>
          <Badge className='bg-amber-100 text-amber-800 hover:bg-amber-100'>
            Coming Soon
          </Badge>
        </div>
      )}
      <CardHeader className='pb-0'>
        <div className='flex justify-center mb-4'>{icon}</div>
        <CardTitle className='text-xl'>{title}</CardTitle>
        {description ? (
          <CardDescription className='mt-2'>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='flex justify-between text-sm text-muted-foreground mt-4'>
          <div className='flex items-center gap-1'>
            <Badge variant='outline'>{capitalize(difficulty)}</Badge>
          </div>
          {available ? (
            <div className='flex items-center gap-1'>
              <span>{questions} Questions</span>
              <BookOpen className='h-4 w-4' />
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        {available && href ? (
          <Button className='w-full' asChild>
            <Link href={href}>Start Learning</Link>
          </Button>
        ) : (
          <Button className='w-full' disabled={!available}>
            {available ? 'Start Learning' : 'Coming Soon'}
          </Button>
        )}
      </CardFooter>
      {!available && (
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none' />
      )}
    </Card>
  );
}
