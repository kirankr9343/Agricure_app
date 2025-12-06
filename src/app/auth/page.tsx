
"use client";
import { AuthForm } from './auth-form';
import OnboardingLayout from '@/app/onboarding/layout';
import { useTranslation } from '@/hooks/use-language';
import Link from 'next/link';

export default function AuthPage() {
  const { t } = useTranslation();

  return (
    <OnboardingLayout>
      <div className="space-y-4">
        <AuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t('auth.agreement.prefix')}{' '}
          <Link
            href="/onboarding/terms"
            target="_blank"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('auth.agreement.terms')}
          </Link>{' '}
          &{' '}
          <Link
            href="/onboarding/terms"
            target="_blank"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('auth.agreement.privacy')}
          </Link>
          .
        </p>
      </div>
    </OnboardingLayout>
  );
}
