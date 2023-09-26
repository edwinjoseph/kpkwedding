import { createSignal, For, Show } from 'solid-js';
import { z } from 'zod';
import { createForm, setValues, SubmitHandler, zodForm } from '@modular-forms/solid';
import { ClientInvite, InvitedTo } from '@lib/supabase/invites';
import FindInviteForm from '@components/RSVP/FindInviteForm';
import LoginFlowForm from '@components/LoginFlowForm';

const RSVPSchema = z.object({
    users: z.array(
        z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            isComing: z.boolean(),
            isVegan: z.boolean().optional(),
            isVegetarian: z.boolean().optional(),
            noGluten: z.boolean().optional(),
            noNuts: z.boolean().optional(),
            noDairy: z.boolean().optional(),
            other: z.string().optional()
        })
    ).optional()
})

type RSVPFormType = z.infer<typeof RSVPSchema>;

const RSVPForm = (props: { isAuthenticated: boolean }) => {
    const [ invite, setInvite ] = createSignal<ClientInvite | null>(null);
    const [ shouldLogin, setShouldLogin ] = createSignal(false);
    const [ rsvpForm, { Form, Field }] = createForm<RSVPFormType>({
        validateOn: 'blur',
        validate: zodForm(RSVPSchema)
    });

    const handleFoundInvite = (invite: ClientInvite) => {
        setInvite(invite);
        const users = invite.users.map(user => ({ firstName: user.firstName, lastName: user.lastName, email: user.email })) as RSVPFormType['users'];

        if (users) {
            setValues(rsvpForm, 'users', users, {
                shouldFocus: false,
                shouldTouched: true,
                shouldDirty: true,
                shouldValidate: false
            });
        }
    }

    const handleRequiresAuth = () => {
        if (!props.isAuthenticated) {
            setShouldLogin(true);
            return;
        }
    }

    const handleAuthorised = () => {

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

    const handleRSVPSubmit: SubmitHandler<RSVPFormType> = (values) => {

    }

    return (
        <div class="max-w-[600px] mx-auto text-center">
            <Show when={invite() === null && shouldLogin() === false}>
                <FindInviteForm onFound={handleFoundInvite} onRequiresAuth={handleRequiresAuth} />
            </Show>
            <Show when={invite() === null && shouldLogin() === true}>
                <h3 class="text-[18px] md:text-[24px] font-bold mb-[24px]">Your invitation</h3>
                <p class="md:text-[18px] mb-[24px]">Welcome back! To edit your RSVP you will need to sign in.</p>
                <div class="max-w-[400px] mx-auto">
                    <LoginFlowForm onAuthorised={handleAuthorised} />
                </div>
            </Show>
            <Show when={invite() !== null}>
                <h3 class="text-[18px] md:text-[24px] font-bold mb-[24px]">Your invitation</h3>
                <p class="md:text-[18px]">{renderInviteDescription()}</p>
                <For each={invite()?.users}>
                    {(user) => (
                        <>
                            <hr class="my-[40px] border-t border-[#CBCBCB]" />
                            <h4 class="text-[18px] md:text-[24px] font-bold mb-[24px]">{user.firstName} {user.lastName}</h4>
                            <h5 class="md:text-[18px] font-semibold mb-[24px]">Can you make it?</h5>
                        </>
                    )}
                </For>
            </Show>
        </div>
    );
}

export default RSVPForm;
