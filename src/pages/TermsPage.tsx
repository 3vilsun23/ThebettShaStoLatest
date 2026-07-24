import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Moon, Sun, ScrollText } from 'lucide-react';
import { useStory } from '../lib/useStory';
import type { Route } from '../lib/router';

type Props = {
  navigate: (r: Route) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function TermsPage({ navigate, theme, onToggleTheme }: Props) {
  const { words } = useStory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen paper-texture">
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 group"
        >
          <BookOpen className="w-5 h-5 text-ink-500 dark:text-ink-300 group-hover:text-accent-500 transition-colors" strokeWidth={1.5} />
          <h1 className="font-serif text-xl md:text-2xl font-medium text-ink-800 dark:text-ink-100 tracking-tight">
            The Shared Story
          </h1>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-ink-500 dark:text-ink-300 hover:text-ink-800 dark:hover:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink-100/80 dark:bg-ink-900/80 border border-ink-200/60 dark:border-ink-800/60">
            <span className="font-sans text-xs uppercase tracking-widest text-ink-400 dark:text-ink-400">Words</span>
            <span className="font-serif text-lg font-semibold text-ink-700 dark:text-ink-100 tabular-nums">
              {words.length.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-8 md:pt-12 pb-20">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors mb-8 font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to the story
        </button>

        <div
          className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-50 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400">
              <ScrollText className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-400">
              Legal
            </p>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-light text-ink-800 dark:text-ink-100 leading-tight mb-3">
            Terms of Service
          </h1>
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500 mb-10">
            Last updated: July 18, 2026
          </p>

          <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-10">
            Welcome to The Shared Story. By accessing or using this website, you
            agree to these Terms of Service. If you do not agree with these terms,
            please do not use the website.
          </p>

          <div className="space-y-10">
            <Section number="1" title="About the Website">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                The Shared Story is a collaborative storytelling platform where
                users contribute one word at a time to create a continuously
                evolving story.
              </p>
            </Section>

            <Section number="2" title="Eligibility">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                You must comply with all applicable laws when using this website.
                If you are under the age required to consent to online services in
                your country, you should use the website only with permission from
                a parent or legal guardian.
              </p>
            </Section>

            <Section number="3" title="User Accounts">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                Some features require signing in with a supported authentication
                provider.
              </p>
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-2">
                You are responsible for:
              </p>
              <BulletList
                items={[
                  'Keeping your account secure.',
                  'Any activity that occurs through your account.',
                  'Providing accurate account information where applicable.',
                ]}
              />
            </Section>

            <Section number="4" title="Contributions">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                By submitting a word or any other content, you confirm that:
              </p>
              <BulletList
                items={[
                  'You have the right to submit it.',
                  'It does not violate any laws or infringe on anyone else\'s rights.',
                  'It is not abusive, hateful, defamatory, obscene, or intended to harm others.',
                ]}
              />
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mt-4">
                You retain ownership of your submissions. However, by submitting
                content, you grant The Shared Story a worldwide, non-exclusive,
                royalty-free license to display, store, reproduce, and distribute
                your contributions as part of the collaborative story and the
                operation of the website.
              </p>
            </Section>

            <Section number="5" title="Contribution Limits">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                The website may limit how often users can contribute (for example,
                one word every 24 hours). Attempts to bypass these limits may
                result in temporary or permanent restrictions.
              </p>
            </Section>

            <Section number="6" title="Prohibited Conduct">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <BulletList
                items={[
                  'Attempt to disrupt or damage the website.',
                  'Circumvent security measures.',
                  'Use bots or automated systems without permission.',
                  'Upload malicious software.',
                  'Harass or abuse other users.',
                  'Attempt to manipulate or spam the story.',
                ]}
              />
            </Section>

            <Section number="7" title="Moderation">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                We reserve the right to remove contributions, suspend accounts, or
                restrict access if content violates these Terms or if necessary to
                maintain the integrity of the platform.
              </p>
            </Section>

            <Section number="8" title="Availability">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                We strive to keep the website available but do not guarantee
                uninterrupted service. Features may change, be removed, or be
                temporarily unavailable without notice.
              </p>
            </Section>

            <Section number="9" title="Disclaimer">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                The website is provided "as is" without warranties of any kind. We
                do not guarantee that the service will always be error-free,
                secure, or available.
              </p>
            </Section>

            <Section number="10" title="Limitation of Liability">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                To the maximum extent permitted by law, The Shared Story shall not
                be liable for any indirect, incidental, special, or consequential
                damages resulting from your use of the website.
              </p>
            </Section>

            <Section number="11" title="Changes">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                These Terms may be updated from time to time. Continued use of the
                website after changes become effective constitutes acceptance of
                the revised Terms.
              </p>
            </Section>

            <Section number="12" title="Contact">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-3">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink-50 dark:bg-ink-800/60 border border-ink-200 dark:border-ink-700">
                <span className="font-sans text-sm text-ink-400 dark:text-ink-500">Email</span>
                <a
                  href="mailto:3vilsun23@gmail.com"
                  className="font-sans text-sm text-accent-600 dark:text-accent-400 font-medium hover:underline"
                >
                  3vilsun23@gmail.com
                </a>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-l-2 border-ink-100 dark:border-ink-800 pl-6">
      <h2 className="font-serif text-xl md:text-2xl font-medium text-ink-800 dark:text-ink-100 mb-3 flex items-baseline gap-3">
        <span className="font-sans text-xs font-semibold text-accent-500 dark:text-accent-400 tracking-widest">
          {number}
        </span>
        <span>{title}</span>
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-500 dark:bg-accent-400 shrink-0" />
          <span className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
