import {createEffect} from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { createServerData$ } from 'solid-start/server';
import * as Sentry from '@sentry/browser';
import { ReportDialogOptions } from '@sentry/browser/types/helpers';
import { getSession } from '@handlers/auth';
import { getInvite } from '@handlers/invites';
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
    const data = useRouteData<typeof routeData>();
    let reportIssueButton: HTMLButtonElement | undefined;

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

    createEffect(() => {
        const firstSection = document.querySelector('main section:first-child');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (reportIssueButton) {
                    reportIssueButton.style.opacity = entry.isIntersecting ? '0' : '1';
                }
            });
        });

        if (firstSection) {
            observer.observe(firstSection);
        }
    });

    return (
        <>
            <header class="bg-white fixed w-full z-10 top-0">
                <div class="flex justify-between px-4 py-6 max-w-[1440px] mx-auto md:px-10">
                    <p class="uppercase font-bold tracking-[3px] md:tracking-[4px]">London</p>
                    <p class="uppercase font-bold tracking-[3px] md:tracking-[4px] before:content-['16.08.24'] md:before:content-['16_august_2024']" />
                </div>
            </header>
            <main class="mt-[72px]">
                <Hero />
                <Agenda />
                <Locations />
                <RSVP isAuthenticated={data()?.isAuthenticated! || false} invite={data()?.invite || null} />
                <Gallery />
                <FAQs />
                <Final />
            </main>
            <button
                ref={reportIssueButton}
                type="button"
                onClick={handleReportIssue}
                style={{ opacity: '0' }}
                class="fixed bottom-[100px] -right-[50px] -rotate-[90deg] bg-pink text-white py-1 px-4 border-0 outline-0 appearance-none text-xs font-semibold uppercase transition-opacity">
                Report issue
            </button>
        </>
    );
}

export default App;
