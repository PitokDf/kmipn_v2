import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'KMIPN - Kompetisi Mahasiswa Informatika Politeknik Nasional',
  description:
    'KMIPN adalah kompetisi tahunan bergengsi untuk mahasiswa informatika Politeknik Nasional. Tunjukkan kemampuan coding, inovasi, dan kreativitas lo di sini!',
  icons: '/images/logos/kmipn-logo.png',
  verification: {
    google: '7UVWLjtHfAA1ccchiarJNOFElAmh6e2a4nHTqbosAZU'
  },
  metadataBase: new URL("https://kmipn.pnp.ac.id"),
  keywords: [
    'kmipn',
    'kmipn pnp',
    'kmipn 7',
    'kmipn vii',
    'kmipn politeknik negeri padang',
    'kompetisi mahasiswa',
    'informatika',
    'politeknik nasional',
    'coding',
    'inovasi',
    'teknologi',
    'kompetisi coding',
    'kompetisi IT'
  ],
  openGraph: {
    title: 'KMIPN - Kompetisi Mahasiswa Informatika Politeknik Nasional',
    description:
      'Buktikan kemampuan team kamu di KMIPN! Kompetisi bergengsi yang menguji kreativitas dan skill coding mahasiswa informatika Politeknik Nasional.',
    url: 'https://kmipn.pnp.ac.id',
    siteName: 'KMIPN',
    images: ['/images/logos/kmipn-logo.png'],
    locale: 'id_ID',
    type: 'website'
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1
    }
  },
  authors: [
    {
      name: 'Pito Desri Pauzi',
      url: 'https://protofolio-ashy-one.vercel.app/',
    },
    { name: "Pito Desri Pauzi", url: "https://github.com/PitokDf" }
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <link rel="icon"
          href="/images/logos/kmipn-logo.png"
          type="image/x-icon" />
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem>
          <DefaultLayout>
            {children}
          </DefaultLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
