import { AuthWrapper } from '@/lib/auth-wrapper';
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: 'KaraokeGoGo',
  description: 'Pour your soul. Remix your world.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload FontAwesome */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <AuthWrapper>
          <Providers>{children}</Providers>
        </AuthWrapper>
      </body>
    </html>
  );
}