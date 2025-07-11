import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoL Guesser",
  description: "TOP SCORE TOP SCORE TOP SCORE TOP SCORE TOP SCORE TOP SCORE",
  openGraph: {
    url: "https://guesser.inhousetracker.com/",
    title: "LoL Guesser",
    description: "TOP SCORE TOP SCORE TOP SCORE TOP SCORE TOP SCORE TOP SCORE",
    siteName: "Inhouse Tracker",
    images: [
      {
        url: "https://guesser.inhousetracker.com/ogimage.jpg",
        width: 1200,
        height: 628,
        alt: "Pixel image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoL Guesser",
    description: "TOP SCORE TOP SCORE TOP SCORE TOP SCORE TOP SCORE TOP SCORE",
    images: {
      url: "https://guesser.inhousetracker.com/ogimage.jpg",
      alt: "Pixel image",
    },
  },
  category: "software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
                (function () {
                  var msg = '🚨  CHEATER! Get out of here 🚨';
                  document.body.prepend(document.createComment(' ' + msg + ' '));
                })();
              `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
