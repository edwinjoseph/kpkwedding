import { Show } from "solid-js";
import { ClientInvite } from '@lib/supabase/invites';
import SubmitButton from '@components/SubmitButton';
import AddCalendarEvent from '@components/RSVP/AddCalendarEvent';
import Tick from './Tick.svg';

const RSVPSubmitted = (props: { invite: ClientInvite, onChangeResponse: () => void; }) => {
    const users = props.invite.users.sort((a, b) => {
        if (a.isComing && !b.isComing) {
            return 1;
        }

        if (!a.isComing && b.isComing) {
            return -1
        }

        return 0;
    });

    const someAreComing = users.some(user => Boolean(user.isComing));
    const allAreComing = users.every(user => Boolean(user.isComing));

    return (
        <>
            <Show when={someAreComing}>
                <div class="mt-10 flex justify-center">
                    <Tick />
                </div>
            </Show>
            <div class="mt-10 text-lg">
                <Show when={allAreComing}>
                    <p>Thanks, we can’t wait to see {users.length === 2 ? 'you both' : 'you'} on the day!</p>
                    <p class="mt-4">Please check out our FAQs below if you have any questions.</p>
                </Show>
                <Show when={users.length === 2 && !allAreComing && someAreComing}>
                    <p>We’re sorry that {users[0].firstName} can’t come, but can’t wait to see you, {users[1].firstName}!</p>
                </Show>
                <Show when={!someAreComing && !allAreComing}>
                    <p>We’re sorry to miss you!</p>
                </Show>
                <Show when={!allAreComing}>
                    <p class="mt-4">Feel free to edit your response before <strong>1 May 2024</strong> or contact us if anything changes.</p>
                </Show>
            </div>
            <div class="mx-auto mt-10 flex max-w-[350px] flex-col gap-4">
                <Show when={someAreComing}>
                    <AddCalendarEvent invite={props.invite} />
                </Show>
                <SubmitButton text="Change response" onClick={props.onChangeResponse} alt={someAreComing} />
            </div>
        </>
    );
}

export default RSVPSubmitted;