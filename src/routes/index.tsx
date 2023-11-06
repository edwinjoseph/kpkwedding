import {createEffect, createSignal} from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { createServerData$ } from 'solid-start/server';
import * as Sentry from '@sentry/browser';
import { ReportDialogOptions } from '@sentry/browser/types/helpers';
import { getSession } from '@handlers/auth';
import { getInvite } from '@handlers/invites';
import twcx from '@utils/tailwind-cx';
import { isRefHTMLButtonElement, isRefHTMLElement } from '@utils/is-type';
import Hero from '@components/Hero';
import Agenda from '@components/Agenda';
import Locations from '@components/Locations';
import Gallery from '@components/Gallery';
import FAQs from '@components/FAQs';
import Final from '@components/Final';
import RSVP from '@components/RSVP';

export function routeData() {
    return createServerData$(async (_, event) => {
        const cookies = event.request.headers.get('cookie');
        const sessionRes = await getSession(cookies || '');

        if (sessionRes.error) {
            return {
                session: null,
                isAuthenticated: false,
                invite: null,
            };
        }

        const inviteRes = await getInvite({ userId: sessionRes.data.user.id }, cookies || '');

        if (inviteRes.error) {
            return {
                session: sessionRes.data,
                isAuthenticated: true,
                invite: null,
            };
        }

        return {
            session: sessionRes.data,
            isAuthenticated: true,
            invite: inviteRes.data,
        }

    }, {
        key: ['invite'],
        initialValue: {
            session: null,
            isAuthenticated: false,
            invite: null,
        }
    })
}

const App = () => {
    let reportIssueButton: HTMLButtonElement | ((el: HTMLButtonElement) => void) | undefined;
    let heroSection: HTMLElement | ((el: HTMLElement) => void) | undefined;
    let titleImage: HTMLElement | ((el: HTMLElement) => void) | undefined;
    const [ isHeaderFixed, setIsHeaderFixed ] = createSignal(false);
    const data = useRouteData<typeof routeData>();

    const user = () => (!data() || !data()?.session) ? null : data()!.session!.user;

    const handleReportIssue = () => {
        const eventId = Sentry.captureMessage('User Feedback');

        const options: ReportDialogOptions = {
            eventId,
            title: 'Encountered an issue?',
            subtitle: 'Please use the form below to let us know.',
            subtitle2: ''
        };

        if (data()?.session) {
            options.user = {
                email: user()?.email,
                name: `${user()?.user_metadata.first_name} ${user()?.user_metadata.last_name}`
            }
        }

        Sentry.showReportDialog(options)
    }

    const handleHeaderLogo = () => {
        const height = isRefHTMLElement(heroSection)
            ? heroSection.getBoundingClientRect().height / 2
            : 0;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (isRefHTMLButtonElement(reportIssueButton)) {
                    reportIssueButton.style.opacity = entry.isIntersecting ? '0' : '1';
                }

                if (isRefHTMLElement(titleImage)) {
                    setIsHeaderFixed(!entry.isIntersecting);
                    titleImage.style.top = entry.isIntersecting ? '-5px' : '50%';
                    titleImage.style.opacity = entry.isIntersecting ? '0' : '1';
                }
            });
        }, { rootMargin: `-${height + 80}px 0px 0px 0px` });

        if (isRefHTMLElement(heroSection)) {
            observer.observe(heroSection);
        }
    }

    createEffect(() => {
        handleHeaderLogo();
        window.addEventListener('resize', handleHeaderLogo);

        return () => {
            window.removeEventListener('resize', handleHeaderLogo);
        }
    });

    return (
        <>
            <script src="https://cdn.jsdelivr.net/npm/add-to-calendar-button@2" async defer />
            <header class={twcx('fixed top-0 z-10 w-full bg-white', {
                'border-b': isHeaderFixed(),
            })}>
                <div class="text-xs mx-auto flex justify-between px-4 py-6 md:text-base md:px-10">
                    <p class="font-bold uppercase tracking-[3px] md:tracking-[4px]">London</p>
                    <picture ref={titleImage} class="absolute top-[-5px] opacity-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-[top_opacity] ease-in-out duration-300">
                        <source media="(max-width: 767px)" srcset="/assets/title-mobile.svg" />
                        <source media="(min-width: 768px)" srcset="/assets/title.svg" />
                        <img src="/assets/title.svg" alt="Kezia & James" loading="eager" />
                    </picture>
                    <p class="font-bold uppercase tracking-[3px] before:content-['16.08.24'] md:tracking-[4px] md:before:content-['16_august_2024']" />
                </div>
            </header>
            <main class="mt-[64px] md:mt-[72px]">
                <Hero ref={heroSection} />
                <Agenda />
                <Locations />
                <RSVP isAuthenticated={data()?.isAuthenticated || false} invite={data()?.invite || null} />
                <Gallery />
                <FAQs />
                <Final />
            </main>
            <button
                ref={reportIssueButton}
                type="button"
                onClick={handleReportIssue}
                style={{ opacity: '0' }}
                class="fixed bottom-[100px] right-[-50px] rotate-[-90deg] appearance-none border-0 bg-pink px-4 py-1 text-xs font-semibold uppercase text-white outline-0 transition-opacity">
                Report issue
            </button>
        </>
    );
}

export default App;
