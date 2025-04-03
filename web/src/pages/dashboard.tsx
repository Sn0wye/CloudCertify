'use client';
import { ArrowLeft, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { Footer } from '@/components/footer';
import { CertificationCard } from '@/components/certification-card';
import { certifications } from '@/data/certifications';

export function DashboardPage() {
  // Filter to only show available certifications
  const availableCertifications = certifications.filter(cert => cert.available);

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <Link href='/' className='flex gap-2 items-center text-xl font-bold'>
            <Cloud className='h-6 w-6 text-sky-500' />
            <span>CloudCertify</span>
          </Link>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 container py-8'>
        <div className='flex flex-col gap-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              Continue your AWS certification journey
            </p>
          </div>

          <section>
            <h2 className='text-xl font-semibold mb-4'>
              Available Certifications
            </h2>

            {availableCertifications.length === 0 ? (
              <Card className='p-8 text-center'>
                <p className='text-muted-foreground'>
                  No certifications are currently available.
                </p>
              </Card>
            ) : (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {availableCertifications.map(cert => (
                  <CertificationCard
                    key={cert.id}
                    title={cert.title}
                    description={cert.description}
                    icon={cert.icon}
                    difficulty={cert.difficulty}
                    questions={cert.questions}
                    available={cert.available}
                    href={cert.href}
                  />
                ))}
              </div>
            )}
          </section>

          <section className='mt-8'>
            <h2 className='text-xl font-semibold mb-4'>Coming Soon</h2>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {certifications
                .filter(cert => !cert.available)
                .map(cert => (
                  <CertificationCard
                    key={cert.id}
                    title={cert.title}
                    description={cert.description}
                    icon={cert.icon}
                    difficulty={cert.difficulty}
                    questions={cert.questions}
                    available={cert.available}
                    href={cert.href}
                  />
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
