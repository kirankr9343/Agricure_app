import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function AgricureLogo({ className }: LogoProps) {
  return (
    <div className={cn("relative rounded-full overflow-hidden", className)}>
      <Image
        src="https://i.postimg.cc/mDPzWMzg/Gemini-Generated-Image-5u9ky05u9ky05u9k.png"
        alt="Agricure Logo"
        fill
        sizes="20vw"
        className="object-contain"
        priority
      />
    </div>
  );
}
