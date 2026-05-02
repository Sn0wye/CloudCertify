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

type TierKey = 'foundational' | 'associate' | 'specialist';

type TierStyle = {
  label: string;
  marker: string;
  markerRing: string;
  rail: string;
  nodeBorder: string;
  nodeIconBg: string;
  nodeIcon: string;
  accent: string;
};

const TIER_STYLES: Record<TierKey, TierStyle> = {
  foundational: {
    label: 'text-emerald-700',
    marker: 'border-emerald-500 text-emerald-700 bg-emerald-50',
    markerRing: 'ring-emerald-100',
    rail: 'border-emerald-200',
    nodeBorder: 'border-emerald-200 hover:border-emerald-400',
    nodeIconBg: 'bg-emerald-50',
    nodeIcon: 'text-emerald-600',
    accent: 'bg-emerald-500'
  },
  associate: {
    label: 'text-sky-700',
    marker: 'border-sky-500 text-sky-700 bg-sky-50',
    markerRing: 'ring-sky-100',
    rail: 'border-sky-200',
    nodeBorder: 'border-sky-200 hover:border-sky-400',
    nodeIconBg: 'bg-sky-50',
    nodeIcon: 'text-sky-600',
    accent: 'bg-sky-500'
  },
  specialist: {
    label: 'text-orange-700',
    marker: 'border-orange-500 text-orange-700 bg-orange-50',
    markerRing: 'ring-orange-100',
    rail: 'border-orange-200',
    nodeBorder: 'border-orange-200 hover:border-orange-400',
    nodeIconBg: 'bg-orange-50',
    nodeIcon: 'text-orange-600',
    accent: 'bg-orange-500'
  }
};

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
        <h4
          className={cn(
            'mb-4 text-xl md:text-2xl font-bold tracking-tight',
            styles.label
          )}
        >
          {tier.label}
        </h4>

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

  const content = (
    <>
      {/* Tier color accent stripe */}
      <div
        aria-hidden='true'
        className={cn(
          'absolute left-0 top-0 h-full w-1',
          available ? styles.accent : 'bg-muted-foreground/20'
        )}
      />

      <div className='flex items-start gap-3'>
        <div
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            available ? styles.nodeIconBg : 'bg-muted'
          )}
        >
          {available ? (
            getLucideIcon(quiz.iconName, {
              className: cn('h-5 w-5', styles.nodeIcon)
            })
          ) : (
            <Lock className='h-4 w-4 text-muted-foreground' />
          )}
        </div>

        <div className='min-w-0 flex-1'>
          {code && (
            <div className='font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'>
              {code}
            </div>
          )}
          <h5 className='text-sm font-bold leading-snug text-balance'>
            {name}
          </h5>
        </div>

        {available && (
          <ArrowRight
            className={cn(
              'h-4 w-4 shrink-0 mt-3 transition-transform group-hover:translate-x-0.5',
              styles.nodeIcon
            )}
          />
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    'group relative flex overflow-hidden rounded-xl border bg-card p-4 transition-all',
    available
      ? cn(
          styles.nodeBorder,
          'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
        )
      : 'border-dashed border-border/80 opacity-70'
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
