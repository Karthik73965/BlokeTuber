import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BlokeTuber — AI Video Pipeline',
  description:
    'AI-powered video assembly pipeline. Feed it your script, voiceovers, and clips. Get a near-final MP4.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
