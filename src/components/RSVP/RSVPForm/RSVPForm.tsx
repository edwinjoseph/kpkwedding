import {createEffect, createSignal, Show} from 'solid-js';
import { refetchRouteData } from 'solid-start';
import { ClientInvite, InvitedTo } from '@lib/supabase/invites';
import FindInviteForm, { FindInviteFormProps, FindInviteFormType } from '@components/RSVP/FindInviteForm';
import LoginFlowForm from '@components/LoginFlowForm';
import InviteResponseForm from '@components/RSVP/InviteResponseForm';
import RSVPSubmitted from '@components/RSVP/RSVPSubmitted';
import {verifyInvite} from '@handlers/invites';
import APIError from '@errors/APIError';

const RSVPForm = (props: { isAuthenticated: boolean, invite: ClientInvite | null }) => {
    const [ findInviteData, setFindInviteData ] = createSignal<FindInviteFormType | null>(null)
    const [ invite, setInvite ] = createSignal<ClientInvite | null>(props.invite || null);
    const [ shouldLogin, setShouldLogin ] = createSignal(props.isAuthenticated || false);
    const [ showSubmission, setShowSubmission ] = createSignal(props.invite && props.isAuthenticated);

    const handleFindInvite: FindInviteFormProps['onSubmit'] = (values) => {
        setFindInviteData(values);
    }

    const handleFoundInvite: FindInviteFormProps['onFound'] = (invite) => {
        if (invite) {
            setInvite(invite);
        }
    }

    const handleRequiresAuth = () => {
        if (!props.isAuthenticated) {
            setShouldLogin(true);
            return;
        }
    }

    const handleEmailSubmitted = async (email: string) => {
        const data = findInviteData();

        if (!data) {
            return;
        }

        const res = await verifyInvite({
            firstName: data.firstName,
            lastName: data.lastName,
            email: email
        });

        if (res.error) {
            throw new APIError('Email address provided does not match with email address linked', res.error.code);
        }
    }

    const handleAuthorised = async () => {
        await refetchRouteData(['invite']);
    }

    const handleOnSubmission = (invite: ClientInvite) => {
        setInvite(invite);
        setShowSubmission(true);
    }

    const renderInviteDescription = () => {
        const data = invite();

        if (!data) {
            return;
        }

        let personInvited = 'you';
        let invitedTo = 'ceremony and reception, starting at 12:00 at The Asylum Chapel';

        if (data.invitedTo === InvitedTo.RECEPTION) {
            invitedTo = 'evening reception, starting at 19:00 at The Lordship Pub.'
        }

        if (data.users.length === 2) {
            personInvited += ` and ${data.users[1].firstName}`;
        }

        return `Hi ${data.users[0].firstName}, ${personInvited} are invited to our ${invitedTo}.`
    }

    createEffect(() => {
        if (props.isAuthenticated !== shouldLogin()) {
            setInvite(props.invite);
            setShouldLogin(props.isAuthenticated);
            setShowSubmission(props.invite && props.isAuthenticated)
        }
    })

    return (
        <div class="max-w-[600px] mx-auto text-center">
            <Show when={invite() === null && !shouldLogin() && !showSubmission()}>
                <FindInviteForm onSubmit={handleFindInvite} onFound={handleFoundInvite} onRequiresAuth={handleRequiresAuth} />
            </Show>
            <Show when={invite() === null && shouldLogin() && !showSubmission()}>
                <h3 class="text-[18px] md:text-[24px] font-bold mb-[24px]">Your invitation</h3>
                <p class="md:text-[18px] mb-[24px]">Welcome back! To edit your RSVP you will need to sign in.</p>
                <div class="max-w-[400px] mx-auto">
                    <LoginFlowForm onEmailSubmit={handleEmailSubmitted} onAuthorised={handleAuthorised} />
                </div>
            </Show>
            <Show when={invite() !== null && !showSubmission()}>
                <h3 class="text-[18px] md:text-[24px] font-bold mb-[24px]">Your invitation</h3>
                <p class="md:text-[18px]">{renderInviteDescription()}</p>
                <InviteResponseForm invite={invite()!} isAuthenticated={props.isAuthenticated} onSubmit={handleOnSubmission} />
            </Show>
            <Show when={invite() !== null && showSubmission()}>
                <RSVPSubmitted invite={invite()!} onChangeResponse={() => setShowSubmission(false)}  />
            </Show>
        </div>
    );
}

export default RSVPForm;
