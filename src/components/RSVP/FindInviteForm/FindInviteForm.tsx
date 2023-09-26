import { createSignal, Show } from 'solid-js';
import { createForm, getErrors, SubmitHandler, validate, zodForm } from '@modular-forms/solid';
import { z } from 'zod';
import GenericInput from '@components/GenericInput';
import LabelError from '@components/LabelError';
import SubmitButton from '@components/SubmitButton';
import { ClientInvite } from '@lib/supabase/invites';
import { ErrorCodes } from '@utils/error-codes';
import { getInvite } from '../../../handlers/invites';

const FindInviteFormSchema = z.object({
    firstName: z.string().min(2, 'Your first name must have at least 2 characters'),
    lastName: z.string().min(2, 'Your last name must have at least 2 characters'),
})

type FindInviteFormType = z.infer<typeof FindInviteFormSchema>;

interface FindInviteFormProps {
    onRequiresAuth: (values: FindInviteFormType) => void;
    onFound: (invite: ClientInvite) => void;
}

const FindInviteForm = (props: FindInviteFormProps) => {
    const [ fullNameError, setFullNameError ] = createSignal<string | null>(null);
    const [ rsvpForm, { Form, Field }] = createForm<FindInviteFormType>({
        validateOn: 'blur',
        validate: zodForm(FindInviteFormSchema)
    });

    const hasNameErrors = () => {
        const errors = getErrors(rsvpForm, ['firstName', 'lastName']);
        return errors.firstName || errors.lastName || fullNameError();
    }

    const handleFindInvite: SubmitHandler<FindInviteFormType> = async (values) => {
        setFullNameError(null);

        if (hasNameErrors()) {
            return;
        }

        if (!values.firstName && !values.lastName) {
            setFullNameError('Please enter your first and last name');
            return;
        }

        if (!values.firstName || !values.lastName) {
            await validate(rsvpForm, ['firstName', 'lastName']);
            return;
        }

        const data = await getInvite({
            firstName: values.firstName,
            lastName: values.lastName
        });

        if ('error' in data && data.error) {
            switch (data.error.code) {
                case ErrorCodes.INVITE_USER_NOT_FOUND:
                    setFullNameError('Invitation not found');
                    break;
                case ErrorCodes.AUTH_NOT_AUTHORISED:
                    props.onRequiresAuth(values);
                    break;
                default:
                    setFullNameError('Something went wrong, please try again');
                    break;
            }
            return;
        }

        props.onFound(data as ClientInvite);
    }

    return (
        <Form onSubmit={handleFindInvite}>
            <p class="md:text-[18px] mb-[16px]">Please respond by</p>
            <p class="md:text-[18px] mb-[16px] font-semibold">1 May 2025</p>
            <p class="md:text-[18px]">Enter your first and last name to find your invite.</p>
            <div class="max-w-[480px] mx-auto my-[24px]">
                <div class="flex gap-x-4">
                    <Field type="string" name="firstName">
                        {(field, props) => (
                            <div class="flex-1">
                                <GenericInput
                                    {...props}
                                    type="text"
                                    placeholder="First name"
                                    value={field.value}
                                    hasError={field.error !== undefined}
                                    required
                                />
                            </div>
                        )}
                    </Field>
                    <Field type="string" name="lastName">
                        {(field, props) => (
                            <div class="flex-1">
                                <GenericInput
                                    {...props}
                                    type="text"
                                    placeholder="Last name"
                                    value={field.value}
                                    hasError={field.error !== undefined}
                                    required
                                />
                            </div>
                        )}
                    </Field>
                </div>
                <Show when={hasNameErrors()}>
                    <div class="text-left">
                        <Show when={fullNameError()}>
                            <LabelError name="firstName" text={fullNameError()!} />
                        </Show>
                        <Show when={!fullNameError() && (getErrors(rsvpForm).firstName || getErrors(rsvpForm).lastName)}>
                            <LabelError name={getErrors(rsvpForm).firstName ? 'firstName' : 'lastName'} text={getErrors(rsvpForm).firstName || getErrors(rsvpForm).lastName!} />
                        </Show>
                    </div>
                </Show>
            </div>
            <SubmitButton text="Find my invite" />
        </Form>
    )
}

export default FindInviteForm;
