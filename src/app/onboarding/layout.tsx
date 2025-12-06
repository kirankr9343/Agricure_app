import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AgricureLogo } from '@/components/icons/logo';

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authBg = PlaceHolderImages.find(p => p.id === 'auth-background');

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 bg-farm-landscape">
      {authBg && (
        <Image
          src={authBg.imageUrl}
          alt={authBg.description}
          fill
          className="object-cover opacity-30"
          data-ai-hint={authBg.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </main>
  );
}
