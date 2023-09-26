import { createServerData$ } from 'solid-start/server';
import { useRouteData } from '@solidjs/router';
import { getSession } from '../handlers/auth';
import { getInvite } from '../handlers/invites';
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
        const data = await getSession(cookies || '');

        if ('error' in data) {
            return {
                isAuthenticated: false,
                invite: null,
            };
        }

        const invite = await getInvite({ userId: data.user.id }, cookies || '');

        if ('error' in invite) {
            return {
                isAuthenticated: true,
                invite: null,
            };
        }

        return {
            isAuthenticated: true,
            invite,
        }

    }, {
        key: ['invite'],
        initialValue: {
            isAuthenticated: false,
            invite: null,
        }
    })
}

const App = () => {
    const data = useRouteData<typeof routeData>();
    console.log(data());
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
                <RSVP isAuthenticated={data()?.isAuthenticated! || false} />
                <Gallery />
                <FAQs />
                <Final />
            </main>
        </>
    );
}

export default App;
