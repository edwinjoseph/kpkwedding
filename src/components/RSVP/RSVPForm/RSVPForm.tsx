import { createEffect, createSignal, Ref, Show } from 'solid-js';
import { refetchRouteData } from 'solid-start';
import { ClientInvite, InvitedTo } from '@lib/supabase/invites';
import {isRefHTMLHeadingElement} from '@utils/is-type';
import { verifyInvite } from '@handlers/invites';
import FindInviteForm, { FindInviteFormProps, FindInviteFormType } from '@components/RSVP/FindInviteForm';
import LoginFlowForm from '@components/LoginFlowForm';
import InviteResponseForm from '@components/RSVP/InviteResponseForm';
import RSVPSubmitted from '@components/RSVP/RSVPSubmitted';
import APIError from '@errors/APIError';

const RSVPForm = (props: { rsvpRef: Ref<HTMLHeadingElement>, isAuthenticated: boolean, invite: ClientInvite | null }) => {
    const [ findInviteData, setFindInviteData ] = createSignal<FindInviteFormType | null>(null)
    const [ invite, setInvite ] = createSignal<ClientInvite | null>(props.invite || null);
    const [ shouldLogin, setShouldLogin ] = createSignal(false);
    const [ isSubmitted, setIsSubmitted ] = createSignal(false);
    const [ showSubmission, setShowSubmission ] = createSignal(props.invite && props.isAuthenticated);

    const handleScrollToTop = () => {
        if (isRefHTMLHeadingElement(props.rsvpRef)) {
            window.scrollTo({
                top: props.rsvpRef.offsetTop - 120,
                left: 0,
            });
        }
    }

    const handleFindInvite: FindInviteFormProps['onSubmit'] = (values) => {
        setFindInviteData(values);
        handleScrollToTop();
    }

    const handleFoundInvite: FindInviteFormProps['onFound'] = (invite) => {
        if (invite) {
            setInvite(invite);
            handleScrollToTop();
        }
    }

    const handleRequiresAuth = () => {
        if (!props.isAuthenticated) {
            setShouldLogin(true);
            handleScrollToTop();
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

        handleScrollToTop();

        if (res.error) {
            throw new APIError('Email address provided does not match with email address linked', res.error.code);
        }
    }

    const handleAuthorised = async () => {
        handleScrollToTop();
        await refetchRouteData(['invite']);
    }

    const handleOnSubmission = (invite: ClientInvite) => {
        setInvite(invite);
        setShowSubmission(true);
        setIsSubmitted(true);
        handleScrollToTop();
    }

    const renderInviteDescription = () => {
        const data = invite();

        if (!data) {
            return;
        }

        let personInvited = 'you';
        let invitedTo = 'ceremony and reception, starting at midday at The Asylum Chapel';

        if (data.invitedTo === InvitedTo.RECEPTION) {
            invitedTo = 'evening reception, starting at 18:30 at The Lordship Pub'
        }

        if (data.users.length === 2) {
            personInvited += ` and ${data.users[1].firstName}`;
        }

        return `Hi ${data.users[0].firstName}, ${personInvited} are invited to our ${invitedTo}.`
    }

    createEffect(() => {
        setInvite(props.invite);
        setShowSubmission(props.invite && props.isAuthenticated);
    })

    return (
        <div class="mx-auto max-w-[600px] text-center">
            <Show when={invite() === null && !shouldLogin() && !showSubmission()}>
                <FindInviteForm onSubmit={handleFindInvite} onFound={handleFoundInvite} onRequiresAuth={handleRequiresAuth} />
            </Show>
            <Show when={invite() === null && shouldLogin() && !showSubmission()}>
                <h3 class="mb-[24px] text-[18px] font-bold md:text-[24px]">Your invitation</h3>
                <p class="mb-[24px] md:text-[18px]">Welcome back! To edit your RSVP you will need to sign in.</p>
                <div class="mx-auto max-w-[400px]">
                    <LoginFlowForm onEmailSubmit={handleEmailSubmitted} onAuthorised={handleAuthorised} />
                </div>
            </Show>
            <Show when={invite() !== null && !showSubmission()}>
                <h3 class="mb-[24px] text-[18px] font-bold md:text-[24px]">Your invitation</h3>
                <p class="md:text-[18px]">{renderInviteDescription()}</p>
                <InviteResponseForm
                    invite={invite()!}
                    isAuthenticated={props.isAuthenticated}
                    isSubmitted={isSubmitted()}
                    onSubmit={handleOnSubmission}
                />
            </Show>
            <Show when={invite() !== null && showSubmission()}>
                <RSVPSubmitted invite={invite()!} onChangeResponse={() => setShowSubmission(false)}  />
            </Show>
        </div>
    );
}

export default RSVPForm;
