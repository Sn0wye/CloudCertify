import { useMemo, useState } from 'react';
import { ArrowRight, Clock, Lock } from 'lucide-react';
import { Link } from 'wouter';

import { cn } from '@/lib/utils';
import { getLucideIcon } from '@/lib/quiz-icon';
import type {
  QuizDto,
  QuizLevel,
  QuizProvider
} from '@/http/generated/api.schemas';

type Tier = {
  number: string;
  label: string;
  level: QuizLevel;
};

const AWS_TIERS: Tier[] = [
  { number: '01', label: 'Foundational', level: 'foundational' },
  { number: '02', label: 'Associate', level: 'associate' },
  { number: '03', label: 'Specialty', level: 'specialist' }
];

const PROVIDERS: {
  id: QuizProvider;
  label: string;
  short: string;
  available: boolean;
}[] = [
  { id: 'aws', label: 'Amazon Web Services', short: 'AWS', available: true },
  { id: 'azure', label: 'Microsoft Azure', short: 'Azure', available: false },
  { id: 'gcp', label: 'Google Cloud', short: 'GCP', available: false }
];

type CertificationRoadmapProps = {
  quizzes: QuizDto[];
  isLoading?: boolean;
};

export function CertificationRoadmap({
  quizzes,
  isLoading
}: CertificationRoadmapProps) {
  const [provider, setProvider] = useState<QuizProvider>('aws');

  const grouped = useMemo(() => {
    const filtered = quizzes.filter(q => q.quizProvider === provider);
    return AWS_TIERS.map(tier => ({
      ...tier,
      quizzes: filtered.filter(q => q.quizLevel === tier.level)
    }));
  }, [quizzes, provider]);

  return (
    <div className='mx-auto max-w-5xl'>
      {/* Provider selector — segmented terminal control */}
      <div className='mb-12 flex justify-center'>
        <div className='inline-flex border border-border'>
          {PROVIDERS.map(p => {
            const isActive = provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={cn(
                  'flex items-center gap-2 border-r border-border px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.1em] transition-colors last:border-r-0',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{p.short}</span>
                {!p.available && (
                  <span className='text-[9px] tracking-[0.1em] opacity-70'>
                    [soon]
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roadmap body */}
      <div className='space-y-10 md:space-y-14'>
        {grouped.map((tier, tierIndex) => (
          <TierRow
            key={tier.level}
            tier={tier}
            isLast={tierIndex === grouped.length - 1}
            isLoading={isLoading}
            providerAvailable={
              PROVIDERS.find(p => p.id === provider)?.available ?? false
            }
          />
        ))}
      </div>
    </div>
  );
}

type TierRowProps = {
  tier: Tier & { quizzes: QuizDto[] };
  isLast: boolean;
  isLoading?: boolean;
  providerAvailable: boolean;
};

function TierRow({ tier, isLast, isLoading, providerAvailable }: TierRowProps) {
  return (
    <div className='relative grid grid-cols-[48px_1fr] gap-4 md:grid-cols-[72px_1fr] md:gap-8'>
      {/* Left rail: numbered unit marker + connector */}
      <div className='relative flex flex-col items-center'>
        <div className='relative z-10 flex h-12 w-12 items-center justify-center border border-primary bg-primary font-display text-base text-primary-foreground md:h-[72px] md:w-[72px] md:text-2xl'>
          {tier.number}
        </div>
        {!isLast && (
          <div
            aria-hidden='true'
            className='absolute left-1/2 top-12 h-[calc(100%+2.5rem)] w-px -translate-x-1/2 bg-border md:top-[72px] md:h-[calc(100%+3.5rem)]'
          />
        )}
      </div>

      {/* Right content */}
      <div className='min-w-0 pb-2'>
        <div className='mb-4 flex items-baseline gap-3'>
          <h4 className='font-display text-xl uppercase tracking-tight text-foreground md:text-2xl'>
            {tier.label}
          </h4>
          <span className='hud-label'>Tier {tier.number}</span>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {isLoading ? (
            <>
              <NodeSkeleton />
              <NodeSkeleton />
              <NodeSkeleton />
            </>
          ) : tier.quizzes.length > 0 ? (
            tier.quizzes.map(quiz => (
              <CertificationNode key={quiz.id} quiz={quiz} />
            ))
          ) : (
            <EmptyTierCard providerAvailable={providerAvailable} />
          )}
        </div>
      </div>
    </div>
  );
}

function CertificationNode({ quiz }: { quiz: QuizDto }) {
  const available = quiz.isAvailable ?? false;
  const { code, name } = splitTitle(quiz.title ?? '');

  const content = (
    <>
      {/* Status accent stripe */}
      <div
        aria-hidden='true'
        className={cn(
          'absolute left-0 top-0 h-full w-1',
          available ? 'bg-primary' : 'bg-border-strong'
        )}
      />

      <div className='flex items-start gap-3 pl-2'>
        <div
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center border',
            available
              ? 'border-primary bg-primary'
              : 'border-border-strong bg-secondary'
          )}
        >
          {available ? (
            getLucideIcon(quiz.iconName, {
              className: 'h-5 w-5 text-primary-foreground'
            })
          ) : (
            <Lock className='h-4 w-4 text-muted-foreground' />
          )}
        </div>

        <div className='min-w-0 flex-1'>
          {code && <div className='hud-label'>{code}</div>}
          <h5 className='text-sm font-semibold leading-snug text-balance text-foreground normal-case'>
            {name}
          </h5>
        </div>

        {available ? (
          <ArrowRight className='mt-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary' />
        ) : (
          <span className='hud-label shrink-0 self-start text-[9px]'>[soon]</span>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    'group relative flex overflow-hidden border bg-card p-4 transition-colors',
    available
      ? 'border-border hover:border-primary cursor-pointer'
      : 'border-border opacity-60'
  );

  if (available) {
    return (
      <Link href={`/quiz/${quiz.id}`} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}

function NodeSkeleton() {
  return <div className='h-24 animate-pulse border border-border bg-secondary' />;
}

function EmptyTierCard({ providerAvailable }: { providerAvailable: boolean }) {
  return (
    <div className='col-span-full flex items-center gap-3 border border-dashed border-border-strong bg-card p-6 text-sm text-muted-foreground'>
      <Clock className='h-4 w-4 shrink-0 text-primary' />
      <span>
        {providerAvailable
          ? 'No exams at this tier yet. Check back soon.'
          : 'This provider is launching soon. Get notified when it goes live.'}
      </span>
    </div>
  );
}

/**
 * Split a quiz title like "AWS Certified Cloud Practitioner (CLF-C02)" into
 * { name: "AWS Certified Cloud Practitioner", code: "CLF-C02" }.
 */
function splitTitle(title: string): { name: string; code: string | null } {
  const match = title.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), code: match[2].trim() };
  }
  return { name: title, code: null };
}
