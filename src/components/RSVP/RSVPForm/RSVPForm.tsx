import { createEffect, createSignal, Ref, Show } from 'solid-js';
import { refetchRouteData, useSearchParams } from 'solid-start';
import { ClientInvite, InvitedTo } from '@lib/supabase/invites';
import { isRefHTMLElement } from '@utils/is-type';
import { verifyInvite } from '@handlers/invites';
import FindInviteForm, { FindInviteFormProps, FindInviteFormType } from '@components/RSVP/FindInviteForm';
import LoginFlowForm from '@components/LoginFlowForm';
import InviteResponseForm from '@components/RSVP/InviteResponseForm';
import RSVPSubmitted from '@components/RSVP/RSVPSubmitted';
import APIError from '@errors/APIError';
import {scrollToElement} from '@utils/scroll-to-element';

const RSVPForm = (props: { rsvp: Ref<HTMLElement>, isAuthenticated: boolean, invite: ClientInvite | null }) => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ findInviteData, setFindInviteData ] = createSignal<FindInviteFormType | null>(null);
    const [ invite, setInvite ] = createSignal<ClientInvite | null>(props.invite || null);
    const [ shouldLogin, setShouldLogin ] = createSignal(Boolean(searchParams.email));
    const [ isSubmitted, setIsSubmitted ] = createSignal(false);
    const [ showSubmission, setShowSubmission ] = createSignal(props.invite && props.isAuthenticated);

    const handleScrollToTop = () => {
        if (isRefHTMLElement(props.rsvp)) {
            scrollToElement(props.rsvp, {
                includeHeader: true,
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

        if (searchParams.email && props.invite && props.isAuthenticated && isRefHTMLElement(props.rsvp)) {
            setSearchParams({
                email: undefined
            });

            let offset = 0;
            const rsvpImage = props.rsvp.getElementsByTagName('img')[0];

            if (rsvpImage) {
                const style = window.getComputedStyle(rsvpImage);
                offset = rsvpImage.getBoundingClientRect().height + (parseInt(style.marginBottom.replace('px', '')) * 1.5);
            }

            console.log(offset);

            scrollToElement(props.rsvp, {
                includeHeader: true,
                offset: offset,
            });
        }
    });

    return (
        <div class="mx-auto max-w-[600px] text-center">
            <Show when={invite() === null && !shouldLogin() && !showSubmission()}>
                <FindInviteForm onSubmit={handleFindInvite} onFound={handleFoundInvite} onRequiresAuth={handleRequiresAuth} />
            </Show>
            <Show when={invite() === null && shouldLogin() && !showSubmission()}>
                <h3 class="mb-[24px] text-[18px] font-bold md:text-[24px]">Your invitation</h3>
                <p class="mb-[24px] md:text-[18px]">Welcome back! To edit your RSVP you will need to sign in.</p>
                <div class="mx-auto max-w-[400px]">
                    <LoginFlowForm rsvp={props.rsvp} email={searchParams.email} onEmailSubmit={handleEmailSubmitted} onAuthorised={handleAuthorised} />
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
