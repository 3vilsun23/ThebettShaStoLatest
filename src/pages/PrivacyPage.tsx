import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Moon, Sun, Shield } from 'lucide-react';
import { useStory } from '../lib/useStory';
import type { Route } from '../lib/router';

type Props = {
  navigate: (r: Route) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function PrivacyPage({ navigate, theme, onToggleTheme }: Props) {
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
              <Shield className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-400">
              Legal
            </p>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-light text-ink-800 dark:text-ink-100 leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500 mb-10">
            Last updated: July 18, 2026
          </p>

          <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-10">
            At The Shared Story, we value your privacy. This Privacy Policy explains
            what information we collect, how we use it, and the choices you have.
          </p>

          <div className="space-y-10">
            <Section number="1" title="Information We Collect">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                Depending on how you use the website, we may collect:
              </p>
              <BulletList
                items={[
                  'Your name and email address (through authentication providers).',
                  'Basic account information.',
                  'Words and other content you contribute.',
                  'Device information such as browser type and operating system.',
                  'IP address and basic usage logs.',
                  'Cookies and similar technologies necessary for the website to function.',
                ]}
              />
            </Section>

            <Section number="2" title="How We Use Information">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                We use your information to:
              </p>
              <BulletList
                items={[
                  'Operate and maintain the website.',
                  'Authenticate users.',
                  'Enforce contribution limits.',
                  'Prevent abuse and spam.',
                  'Improve the website.',
                  'Respond to support requests.',
                ]}
              />
            </Section>

            <Section number="3" title="Story Contributions">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                Words you submit become part of the collaborative story and may be
                publicly visible. Please avoid submitting personal or sensitive
                information.
              </p>
            </Section>

            <Section number="4" title="Cookies">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <BulletList
                items={[
                  'Keep you signed in.',
                  'Remember preferences.',
                  'Improve performance.',
                  'Protect against abuse.',
                ]}
              />
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mt-4">
                You can manage cookies through your browser settings, although some
                features may not function properly if cookies are disabled.
              </p>
            </Section>

            <Section number="5" title="Third-Party Services">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                We may use trusted third-party services for authentication, hosting,
                analytics, security, or other website functionality. These services
                may process information according to their own privacy policies.
              </p>
            </Section>

            <Section number="6" title="Data Security">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                We use reasonable measures to protect your information, but no online
                service can guarantee absolute security.
              </p>
            </Section>

            <Section number="7" title="Data Retention">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                We retain information only as long as necessary to operate the website,
                comply with legal obligations, resolve disputes, and enforce our
                policies.
              </p>
            </Section>

            <Section number="8" title="Your Rights">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                Depending on your location, you may have rights to:
              </p>
              <BulletList
                items={[
                  'Access your personal information.',
                  'Correct inaccurate information.',
                  'Request deletion of your data.',
                  'Object to or restrict certain processing.',
                  'Request a copy of your data where applicable.',
                ]}
              />
            </Section>

            <Section number="9" title="Children's Privacy">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                The website is not intended for children under the minimum age
                required by applicable law. We do not knowingly collect personal
                information from children without appropriate authorization.
              </p>
            </Section>

            <Section number="10" title="Changes">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                We may update this Privacy Policy from time to time. The updated
                version will be posted on this page with a revised "Last updated"
                date.
              </p>
            </Section>

            <Section number="11" title="Contact">
              <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-3">
                If you have questions about this Privacy Policy or your data, please
                contact:
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
