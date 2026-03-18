import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import PageShell from "../../../components/PageShell";


export const metadata: Metadata = {
  title: "Igor Koryakov Personal Page",
  description: "Art, graphics, pyrography, cryptography, memories, and more.",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // <-- Await the params!
}>) {
  const { locale } = await params; // <-- Await here!
  let messages = {};
  try {
    messages = (await import(`../../lang/${locale}.json`)).default;
  } catch {
    // fallback to empty messages if locale file is missing
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <PageShell>
        {children}
      </PageShell>
      <Footer />
    </NextIntlClientProvider>
  );
}