import './globals.css';

export const metadata = {
  title: 'AI Vision Analyzer',
  description: 'Analyze images with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
