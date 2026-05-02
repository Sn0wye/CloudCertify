import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Clock, Lock } from 'lucide-react';
import { Link } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLucideIcon } from '@/lib/quiz-icon';
import type {
  QuizDto,
  QuizLevel,
  QuizProvider
} from '@/http/generated/api.schemas';

type TierKey = 'foundational' | 'associate' | 'specialist';

type TierStyle = {
  label: string;
  marker: string;
  markerRing: string;
  rail: string;
  badge: string;
  nodeBorder: string;
  nodeIconBg: string;
  nodeIcon: string;
  button: string;
  accent: string;
};

const TIER_STYLES: Record<TierKey, TierStyle> = {
  foundational: {
    label: 'text-emerald-700',
    marker: 'border-emerald-500 text-emerald-700 bg-emerald-50',
    markerRing: 'ring-emerald-100',
    rail: 'border-emerald-200',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    nodeBorder: 'border-emerald-200 hover:border-emerald-400',
    nodeIconBg: 'bg-emerald-50',
    nodeIcon: 'text-emerald-600',
    button: 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800',
    accent: 'bg-emerald-500'
  },
  associate: {
    label: 'text-sky-700',
    marker: 'border-sky-500 text-sky-700 bg-sky-50',
    markerRing: 'ring-sky-100',
    rail: 'border-sky-200',
    badge: 'border-sky-200 bg-sky-50 text-sky-800',
    nodeBorder: 'border-sky-200 hover:border-sky-400',
    nodeIconBg: 'bg-sky-50',
    nodeIcon: 'text-sky-600',
    button: 'text-sky-700 hover:bg-sky-50 hover:text-sky-800',
    accent: 'bg-sky-500'
  },
  specialist: {
    label: 'text-orange-700',
    marker: 'border-orange-500 text-orange-700 bg-orange-50',
    markerRing: 'ring-orange-100',
    rail: 'border-orange-200',
    badge: 'border-orange-200 bg-orange-50 text-orange-800',
    nodeBorder: 'border-orange-200 hover:border-orange-400',
    nodeIconBg: 'bg-orange-50',
    nodeIcon: 'text-orange-600',
    button: 'text-orange-700 hover:bg-orange-50 hover:text-orange-800',
    accent: 'bg-orange-500'
  }
};

type Tier = {
  number: string;
  label: string;
  level: QuizLevel;
  tagline: string;
};

const AWS_TIERS: Tier[] = [
  {
    number: '01',
    label: 'Foundational',
    level: 'foundational',
    tagline: 'Build the cloud fundamentals every AWS role depends on.'
  },
  {
    number: '02',
    label: 'Associate',
    level: 'associate',
    tagline: 'Specialize by role — Developer, SysOps, or Solutions Architect.'
  },
  {
    number: '03',
    label: 'Specialty',
    level: 'specialist',
    tagline: 'Deep expertise in networking, security, and data.'
  }
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

  const totalAvailable = quizzes.filter(
    q => q.quizProvider === provider && q.isAvailable
  ).length;
  const totalCount = quizzes.filter(q => q.quizProvider === provider).length;

  return (
    <div className='mx-auto max-w-5xl'>
      {/* Provider tabs */}
      <div className='flex items-center justify-center gap-2 mb-10'>
        <div className='inline-flex items-center gap-1 rounded-full border bg-background p-1 shadow-sm'>
          {PROVIDERS.map(p => {
            const isActive = provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{p.short}</span>
                {!p.available && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-800'
                    )}
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roadmap header */}
      <div className='flex flex-col items-center text-center mb-12'>
        <Badge
          variant='outline'
          className='mb-3 border-sky-200 bg-sky-50 text-sky-800'
        >
          {PROVIDERS.find(p => p.id === provider)?.label} Roadmap
        </Badge>
        <h3 className='text-2xl md:text-3xl font-bold tracking-tight text-balance'>
          Your path from beginner to certified
        </h3>
        <p className='mt-2 max-w-xl text-muted-foreground'>
          {totalAvailable} of {totalCount} exams available now. More dropping
          weekly.
        </p>

        {/* Tier color legend */}
        <div className='mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs'>
          {AWS_TIERS.map(tier => {
            const styles = TIER_STYLES[tier.level as TierKey];
            return (
              <div
                key={tier.level}
                className='inline-flex items-center gap-2'
              >
                <span
                  className={cn('h-2.5 w-2.5 rounded-full', styles.accent)}
                />
                <span className='font-medium text-muted-foreground'>
                  {tier.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap body */}
      <div className='relative'>
        <div className='space-y-12 md:space-y-16'>
          {grouped.map((tier, tierIndex) => (
            <TierRow
              key={tier.level}
              tier={tier}
              styles={TIER_STYLES[tier.level as TierKey]}
              isLast={tierIndex === grouped.length - 1}
              isLoading={isLoading}
              providerAvailable={
                PROVIDERS.find(p => p.id === provider)?.available ?? false
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type TierRowProps = {
  tier: Tier & { quizzes: QuizDto[] };
  styles: TierStyle;
  isLast: boolean;
  isLoading?: boolean;
  providerAvailable: boolean;
};

function TierRow({
  tier,
  styles,
  isLast,
  isLoading,
  providerAvailable
}: TierRowProps) {
  return (
    <div className='relative grid grid-cols-[48px_1fr] gap-4 md:grid-cols-[64px_1fr] md:gap-8'>
      {/* Left rail: number marker + dashed connector */}
      <div className='relative flex flex-col items-center'>
        <div
          className={cn(
            'relative z-10 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-2 font-mono text-sm md:text-base font-bold shadow-sm ring-4',
            styles.marker,
            styles.markerRing
          )}
        >
          {tier.number}
        </div>
        {!isLast && (
          <div
            aria-hidden='true'
            className={cn(
              'absolute left-1/2 top-12 md:top-14 h-[calc(100%+3rem)] md:h-[calc(100%+4rem)] w-0 -translate-x-1/2 border-l-2 border-dashed',
              styles.rail
            )}
          />
        )}
      </div>

      {/* Right content */}
      <div className='pb-2 min-w-0'>
        <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1'>
          <span
            className={cn(
              'text-xs font-semibold uppercase tracking-widest',
              styles.label
            )}
          >
            Tier {tier.number}
          </span>
          <h4 className='text-xl md:text-2xl font-bold tracking-tight'>
            {tier.label}
          </h4>
        </div>
        <p className='text-sm text-muted-foreground mb-5 max-w-xl'>
          {tier.tagline}
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoading ? (
            <>
              <NodeSkeleton />
              <NodeSkeleton />
              <NodeSkeleton />
            </>
          ) : tier.quizzes.length > 0 ? (
            tier.quizzes.map(quiz => (
              <CertificationNode
                key={quiz.id}
                quiz={quiz}
                styles={styles}
              />
            ))
          ) : (
            <EmptyTierCard providerAvailable={providerAvailable} />
          )}
        </div>
      </div>
    </div>
  );
}

function CertificationNode({
  quiz,
  styles
}: {
  quiz: QuizDto;
  styles: TierStyle;
}) {
  const available = quiz.isAvailable ?? false;
  const { code, name } = splitTitle(quiz.title ?? '');

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-card p-4 transition-all',
        available
          ? cn(styles.nodeBorder, 'hover:shadow-lg hover:-translate-y-0.5')
          : 'border-dashed border-border/80'
      )}
    >
      {/* Tier color accent stripe */}
      <div
        aria-hidden='true'
        className={cn(
          'absolute left-0 top-0 h-full w-1',
          available ? styles.accent : 'bg-muted-foreground/20'
        )}
      />

      {/* Status badge */}
      <div className='absolute right-3 top-3'>
        {available ? (
          <span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 ring-1 ring-inset ring-green-200'>
            <Check className='h-3 w-3' />
            Live
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-200'>
            <Clock className='h-3 w-3' />
            Soon
          </span>
        )}
      </div>

      <div
        className={cn(
          'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg',
          available ? styles.nodeIconBg : 'bg-muted'
        )}
      >
        {getLucideIcon(quiz.iconName, {
          className: cn(
            'h-5 w-5',
            available ? styles.nodeIcon : 'text-muted-foreground'
          )
        })}
      </div>

      {code && (
        <div className='mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'>
          {code}
        </div>
      )}
      <h5 className='text-sm font-bold leading-snug text-balance pr-12'>
        {name}
      </h5>
      {quiz.description && (
        <p className='mt-1.5 text-xs text-muted-foreground line-clamp-2'>
          {quiz.description}
        </p>
      )}

      <div className='mt-4 flex items-center justify-between border-t pt-3'>
        {available ? (
          <span className='inline-flex items-center gap-1.5 text-xs text-muted-foreground'>
            <BookOpen className='h-3.5 w-3.5' />
            {quiz.questionCount ?? 0} questions
          </span>
        ) : (
          <span className='inline-flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Lock className='h-3.5 w-3.5' />
            In development
          </span>
        )}

        {available ? (
          <Button
            asChild
            size='sm'
            variant='ghost'
            className={cn('h-7 px-2', styles.button)}
          >
            <Link href={`/quiz/${quiz.id}`}>
              Start
              <ArrowRight className='ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function NodeSkeleton() {
  return (
    <div className='h-44 animate-pulse rounded-xl border border-dashed bg-muted/40' />
  );
}

function EmptyTierCard({ providerAvailable }: { providerAvailable: boolean }) {
  return (
    <div className='col-span-full flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground'>
      <Clock className='h-4 w-4 shrink-0' />
      <span>
        {providerAvailable
          ? 'No exams at this tier yet — check back soon.'
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
