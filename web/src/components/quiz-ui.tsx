import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const PASS_THRESHOLD = 70;

export function ScorePanel({
  percentage,
  passed,
  correct,
  total,
  showThreshold = true
}: {
  percentage: number;
  passed: boolean;
  correct: number;
  total: number;
  showThreshold?: boolean;
}) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <div
        className={`flex h-32 w-32 items-center justify-center border-2 ${
          passed
            ? 'border-success bg-success/10'
            : 'border-destructive bg-destructive/10'
        }`}
      >
        <span
          className={`font-display text-5xl ${passed ? 'text-success' : 'text-destructive'}`}
        >
          {percentage}%
        </span>
      </div>

      {showThreshold && (
        <Badge variant={passed ? 'success' : 'destructive'}>
          {passed ? 'PASS' : 'FAIL'} · threshold {PASS_THRESHOLD}%
        </Badge>
      )}

      <p className='font-mono text-base text-foreground'>
        <span className='font-display text-primary'>{correct}</span> / {total}{' '}
        correct
      </p>

      <div className='mt-2 w-full max-w-md'>
        <Progress
          value={percentage}
          indicatorClassName={passed ? 'bg-success' : 'bg-destructive'}
        />
      </div>
    </div>
  );
}

export function StatusGlyph({ correct }: { correct: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center border ${
        correct
          ? 'border-success bg-success/15 text-success'
          : 'border-destructive bg-destructive/15 text-destructive'
      }`}
    >
      {correct ? <Check className='h-4 w-4' /> : <X className='h-4 w-4' />}
    </span>
  );
}

export function OptionRow({
  label,
  text,
  isSelected,
  onClick,
  disabled
}: {
  label: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={() => !disabled && onClick()}
      className={`flex items-center gap-3 border px-4 py-3 transition-colors ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-border-strong'
      } ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[11px] ${
          isSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border-strong text-muted-foreground'
        }`}
      >
        {isSelected ? <Check className='h-4 w-4' /> : label}
      </span>
      <span className='text-sm text-foreground'>{text}</span>
    </div>
  );
}

export function ReviewAnswerRow({
  text,
  isCorrectAnswer,
  isUserAnswer
}: {
  text: string;
  isCorrectAnswer: boolean;
  isUserAnswer: boolean;
}) {
  const tone = isCorrectAnswer
    ? 'border-success bg-success/10'
    : isUserAnswer
      ? 'border-destructive bg-destructive/10'
      : 'border-border bg-card';

  return (
    <div className={`flex items-start gap-3 border px-3 py-2.5 ${tone}`}>
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
          isCorrectAnswer
            ? 'border-success text-success'
            : isUserAnswer
              ? 'border-destructive text-destructive'
              : 'border-border-strong text-muted-foreground'
        }`}
      >
        {isCorrectAnswer ? (
          <Check className='h-3 w-3' />
        ) : isUserAnswer ? (
          <X className='h-3 w-3' />
        ) : null}
      </span>
      <div className='flex-1'>
        <span className='text-sm text-foreground'>{text}</span>
        {isUserAnswer && <span className='hud-label ml-2'>your answer</span>}
        {isCorrectAnswer && (
          <span className='hud-label ml-2 text-success'>correct</span>
        )}
      </div>
    </div>
  );
}
