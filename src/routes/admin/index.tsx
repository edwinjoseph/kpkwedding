import { createSignal, For, Show} from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { createServerData$ } from 'solid-start/server';
import Section from '@components/Section';
import SubmitButton from '@components/SubmitButton';
import InviteModal from '@components/Admin/InviteModal';
import StatusCard from '@components/Admin/StatusCard';
import UserCard from '@components/Admin/UserCard/UserCard';
import { getAllInvitees } from '../../handlers/invites';

export function routeData() {
    return createServerData$(async (_, event) => {
        return getAllInvitees(event.request.headers.get('cookie') || '');
    }, { key: ['invites'], initialValue: [], ssrLoadFrom: 'server' })
}

const Admin = () => {
    const data = useRouteData<typeof routeData>();

    const getInvites = () => {
        const res = data();

        if (!res || !Array.isArray(res)) {
            return [];
        }

        return res;
    }

    const getUnconfirmed = () => {
        const res = data();

        if (!res || !Array.isArray(res)) {
            return [];
        }

        return res.filter(invite => invite.response === null)
    };

    const getAttending = () => {
        const res = data();

        if (!res || !Array.isArray(res)) {
            return [];
        }

        return res.filter(invite => invite.response && invite.isComing)
    };

    const getDeclined = () => {
        const res = data();

        if (!res || !Array.isArray(res)) {
            return [];
        }

        return res.filter(invite => invite.response && !invite.isComing);
    };

    const [ showInviteModal, setShowInviteModal ] = createSignal<boolean>(false);

    return (
        <main class="min-h-screen bg-gray-100 overflow-hidden">
            <Section class="my-6 md:my-8">
                <Section.Container>
                    <div class="flex justify-between items-center mt-[24px] mb-[24px]">
                        <Section.Title heading="h1" text="Dashboard" class="mb-0 md:mb-0" />
                        <Show when={getInvites().length > 0}>
                            <SubmitButton text="Add an invite" class="text-[14px]" onClick={() => setShowInviteModal(true)} />
                        </Show>
                    </div>
                    <div class="grid gap-4 grid-cols-2 md:grid-cols-4">
                        <StatusCard count={getInvites().length} label="Invited" />
                        <StatusCard count={getUnconfirmed().length} label="Unconfirmed" />
                        <StatusCard count={getAttending().length} label="Attending" />
                        <StatusCard count={getDeclined().length} label="Declined" />
                    </div>
                </Section.Container>
            </Section>
            <Section class="my-6 md:my-8">
                <Section.Container>
                    <Show when={getInvites().length === 0}>
                        <div class="mt-[64px]">
                            <h2 class="text-center font-bold md:text-2xl">You haven't invited anyone yet, why not do so now</h2>
                            <div class="text-center mt-[24px]">
                                <SubmitButton text="Add an invite" class="text-[14px]" onClick={() => setShowInviteModal(true)} />
                            </div>
                        </div>
                    </Show>
                    <Show when={getUnconfirmed().length > 0}>
                        <div class="pb-[16px] mb-[16px]">
                            <h2 class="font-bold md:text-2xl">Unconfirmed</h2>
                            <For each={getUnconfirmed()}>
                                {(invite) => (
                                    <UserCard {...invite} />
                                )}
                            </For>
                        </div>
                    </Show>
                    <Show when={getAttending().length > 0}>
                        <div class="pb-[16px] mb-[16px]">
                            <div>
                                <h2 class="font-bold md:text-2xl">Attending</h2>
                            </div>
                            <For each={getAttending()}>
                                {(invite) => (
                                    <UserCard {...invite} />
                                )}
                            </For>
                        </div>
                    </Show>
                    <Show when={getDeclined().length > 0}>
                        <div class="pb-[16px] mb-[16px]">
                            <h2 class="font-bold md:text-2xl">Declined</h2>
                            <For each={getDeclined()}>
                                {(invite) => (
                                    <UserCard {...invite} />
                                )}
                            </For>
                        </div>
                    </Show>
                </Section.Container>
            </Section>
            <InviteModal isOpen={showInviteModal()} closeModal={() => setShowInviteModal(false)} />
        </main>
    );
}

export default Admin;
