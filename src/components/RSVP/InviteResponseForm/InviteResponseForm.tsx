import { z } from 'zod';
import { createForm, getValue, SubmitHandler, zodForm } from '@modular-forms/solid';
import { For, Show} from 'solid-js';
import { ClientInvite } from '@lib/supabase/invites';
import { updateInvite } from '@handlers/invites';
import CheckboxInput from '@components/CheckboxInput';
import RadioInput from '@components/RadioInput';
import SubmitButton from '@components/SubmitButton';
import GenericField from '@components/GenericField';

const RSVPSchema = z.object({
    users: z.array(
        z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email({ message: "Please provide a valid email address" }).optional(),
            userId: z.string().optional(),
            isComing: z.string().optional(),
            isVegan: z.boolean().optional(),
            isVegetarian: z.boolean().optional(),
            noGluten: z.boolean().optional(),
            noNuts: z.boolean().optional(),
            noDairy: z.boolean().optional(),
            addOther: z.boolean().optional(),
            other: z.string().optional()
        }).superRefine((user, ctx) => {
            if (!user.isComing) {
                return;
            }

            if (!user.email && !user.userId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "An email is required to respond to RSVP",
                    path: ['email'],
                });
            }

            if (user.addOther && !user.other) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Other dietary requirements is required when selecting \"Other\"",
                    path: ['other'],
                });
            }
        })
    ).optional()
})

type RSVPFormType = z.infer<typeof RSVPSchema>;

interface InviteResponseFormProps {
    isAuthenticated: boolean;
    invite: ClientInvite
    onSubmit: (invite: ClientInvite) => void;
}

const InviteResponseForm = (props: InviteResponseFormProps) => {
    const [ rsvpForm, { Form, Field, FieldArray }] = createForm<RSVPFormType>({
        validateOn: 'blur',
        validate: zodForm(RSVPSchema),
        initialValues: {
            users: props.invite.users.map((user) => ({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userId: user.id,
                isComing: user.isComing?.toString(),
                isVegan: Boolean(user?.isVegan),
                isVegetarian: Boolean(user?.isVegetarian),
                noGluten: Boolean(user?.noGlutan),
                noNuts: Boolean(user?.noNuts),
                noDairy: Boolean(user?.noDairy),
                addOther: Boolean(user?.other),
                other: user?.other,
            }))
        }
    });

    const handleRSVPSubmit: SubmitHandler<RSVPFormType> = async (values) => {
        const users = values.users!.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.userId,
            email: user.email,
            isComing: user.isComing === 'true',
            isVegan: user.isVegan,
            isVegetarian: user.isVegetarian,
            noGlutan: user.noGluten,
            noNuts: user.noNuts,
            noDairy: user.noDairy,
            other: user.other,
        }));

        await updateInvite({
            id: props.invite.id,
            users,
        });

        props.onSubmit({
            ...props.invite,
            users
        });
    }

    const showResponseForm = (index: number): boolean => {
        if (getValue(rsvpForm, `users.${index}.isComing`) === undefined) {
            return Boolean(props.invite.users[index].isComing);
        }

        return getValue(rsvpForm, `users.${index}.isComing`) === 'true';
    }

    return (
        <Form onSubmit={handleRSVPSubmit}>
            <div class="mb-[24px]">
                <FieldArray name="users">
                    {(fieldArray) => (
                        <div class="grid gap-[24px]">
                            <For each={fieldArray.items}>
                                {(_, index) => {
                                    const user = props.invite.users[index()];
                                    return (
                                        <div class="grid gap-[24px]">
                                            <div>
                                                <Field
                                                    type="string"
                                                    name={`users.${index()}.firstName`}
                                                >
                                                    {(field, props) => (
                                                        <input type="hidden" {...props} name={field.name} value={field.value}  />
                                                    )}
                                                </Field>
                                                <Field
                                                    type="string"
                                                    name={`users.${index()}.lastName`}
                                                >
                                                    {(field, props) => (
                                                        <input type="hidden" {...props} name={field.name} value={field.value}  />
                                                    )}
                                                </Field>
                                                <Field
                                                    type="string"
                                                    name={`users.${index()}.userId`}
                                                >
                                                    {(field, props) => (
                                                        <input type="hidden" {...props} name={field.name} value={field.value}  />
                                                    )}
                                                </Field>
                                                <hr class="my-[40px] border-t border-[#CBCBCB]" />
                                                <h4 class="text-[18px] md:text-[24px] font-bold mb-[24px]">{user.firstName} {user.lastName}</h4>
                                                <h5 class="md:text-[18px] font-semibold mb-[24px]">Can you make it?</h5>
                                                <div class="flex gap-[40px] justify-center">
                                                    <Field
                                                        type="string"
                                                        name={`users.${index()}.isComing`}
                                                    >
                                                        {(field, props) => (
                                                            <>
                                                                <RadioInput
                                                                    {...props}
                                                                    label="Yes"
                                                                    value="true"
                                                                    checked={field.value === 'true'}
                                                                />
                                                                <RadioInput
                                                                    {...props}
                                                                    label="No"
                                                                    value="false"
                                                                    checked={field.value === 'false'}
                                                                />
                                                            </>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                            <Show when={showResponseForm(index())}>
                                                <div>
                                                    <h5 class="md:text-[18px] font-semibold mb-[24px]">Do you have any dietary requirements?</h5>
                                                    <div class="flex gap-[54px] justify-center">
                                                        <div class="flex flex-col gap-[24px]">
                                                            <Field type="boolean" name={`users.${index()}.isVegan`}>
                                                                {(field, props) => (
                                                                    <CheckboxInput {...props} label="Vegan" />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.isVegetarian`}>
                                                                {(field, props) => (
                                                                    <CheckboxInput {...props} label="Vegetarian" />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.noGluten`}>
                                                                {(field, props) => (
                                                                    <CheckboxInput {...props} label="No gluten" />
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div class="flex flex-col gap-[24px]">
                                                            <Field type="boolean" name={`users.${index()}.noNuts`}>
                                                                {(field, props) => (
                                                                    <CheckboxInput {...props} label="No nuts" />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.noDairy`}>
                                                                {(field, props) => (
                                                                    <CheckboxInput {...props} label="No dairy" />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.addOther`}>
                                                                {(field, props) => (
                                                                    <CheckboxInput {...props} label="Other" />
                                                                )}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Show when={Boolean(props.invite.users[index()].other) || getValue(rsvpForm, `users.${index()}.addOther`) === true}>
                                                    <div class="max-w-[400px] w-full mx-auto">
                                                        <Field type="string" name={`users.${index()}.other`}>
                                                            {(field, props) => (
                                                                <GenericField {...props} type="text" value={field.value} error={field.error} label="Other dietary requirements" />
                                                            )}
                                                        </Field>
                                                    </div>
                                                </Show>
                                            </Show>
                                            <Show when={Boolean(getValue(rsvpForm, `users.${index()}.isComing`)) && !props.isAuthenticated}>
                                                <div class="max-w-[400px] w-full mx-auto">
                                                    <Field type="string" name={`users.${index()}.email`}>
                                                        {(field, props) => (
                                                            <GenericField {...props} type="email" value={field.value} error={field.error} label="Email address" placeholder="email@example.com" />
                                                        )}
                                                    </Field>
                                                </div>
                                            </Show>
                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    )}
                </FieldArray>
            </div>
            <SubmitButton text="submit" />
        </Form>
    );
};

export default InviteResponseForm;
