import { createSignal, For, Show} from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { createServerData$ } from 'solid-start/server';
import getHost from '@utils/get-host';
import { ClientInvite, ClientUser, InvitedTo } from '@lib/supabase/invites';
import Section from '@components/Section';
import SubmitButton from '@components/SubmitButton';
import InviteModal from '@components/Admin/InviteModal';
import StatusCard from '@components/Admin/StatusCard';
import UserCard from '@components/Admin/UserCard/UserCard';

interface UserListItem extends ClientUser {
    inviteId: string;
    invitedTo: InvitedTo;
}

export function routeData() {
    return createServerData$(async (_, event) => {
        const response = await fetch(new URL('/api/invites', getHost()).toString(), {
            headers: [
                ['Cookie', event.request.headers.get('cookie') || '']
            ]
        });

        const invites: Array<ClientInvite> = await response.json();

        return invites.reduce<Array<UserListItem>>((acc, invite) => {
            invite.users.forEach(user => {
                acc.push({
                    ...user,
                    inviteId: invite.id,
                    invitedTo: invite.invitedTo,
                });
            })

            return acc;
        }, [])
    }, { key: ['invites'], initialValue: [], ssrLoadFrom: 'server' })
}

const Admin = () => {
    const data = useRouteData<typeof routeData>();
    const getUnconfirmed = () => data()!.filter(invite => invite.response === null);
    const getAttending = () => data()!.filter(invite => invite.response && invite.isComing);
    const getDeclined = () => data()!.filter(invite => invite.response && !invite.isComing);

    const [ showInviteModal, setShowInviteModal ] = createSignal<boolean>(false);

    return (
        <main class="min-h-screen bg-gray-100 overflow-hidden">
            <Section class="my-6 md:my-8">
                <Section.Container>
                    <div class="flex justify-between items-center mt-[24px] mb-[24px]">
                        <Section.Title heading="h1" text="Dashboard" class="mb-0 md:mb-0" />
                        <Show when={data()!.length > 0}>
                            <SubmitButton text="Add an invite" class="text-[14px]" onClick={() => setShowInviteModal(true)} />
                        </Show>
                    </div>
                    <div class="grid gap-4 grid-cols-2 md:grid-cols-4">
                        <StatusCard count={data()!.length} label="Invited" />
                        <StatusCard count={getUnconfirmed().length} label="Unconfirmed" />
                        <StatusCard count={getAttending().length} label="Attending" />
                        <StatusCard count={getDeclined().length} label="Declined" />
                    </div>
                </Section.Container>
            </Section>
            <Section class="my-6 md:my-8">
                <Section.Container>
                    <Show when={data()!.length === 0}>
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
