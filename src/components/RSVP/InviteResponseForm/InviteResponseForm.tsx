import { get } from 'lodash';
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
            id: z.string(),
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
    invite: ClientInvite;
    onSubmit: (invite: ClientInvite) => void;
    isSubmitted: boolean;
}

const InviteResponseForm = (props: InviteResponseFormProps) => {
    const [ rsvpForm, { Form, Field, FieldArray }] = createForm<RSVPFormType>({
        validateOn: 'blur',
        validate: zodForm(RSVPSchema),
        initialValues: {
            users: props.invite.users.map((user) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email ?? undefined,
                userId: user.userId ?? undefined,
                isComing: user.isComing?.toString(),
                isVegan: Boolean(user?.isVegan),
                isVegetarian: Boolean(user?.isVegetarian),
                noGluten: Boolean(user?.noGluten),
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
            id: user.id,
            userId: user.userId,
            email: user.email,
            isComing: user.isComing === 'true',
            isVegan: user.isVegan,
            isVegetarian: user.isVegetarian,
            noGluten: user.noGluten,
            noNuts: user.noNuts,
            noDairy: user.noDairy,
            other: user.addOther ? user.other : undefined,
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
            <div class="mb-10">
                <FieldArray name="users">
                    {(fieldArray) => (
                        <div class="grid gap-[24px]">
                            <For each={fieldArray.items}>
                                {(_, index) => {
                                    const user = props.invite.users[index()];
                                    return (
                                        <div class="grid gap-[24px]">
                                            <div>
                                                <Field type="string" name={`users.${index()}.id`}>
                                                    {(field, fieldProps) => (
                                                        <input
                                                            {...fieldProps}
                                                            type="hidden"
                                                            value={field.value}
                                                        />
                                                    )}
                                                </Field>
                                                <Field type="string" name={`users.${index()}.email`}>
                                                    {(field, fieldProps) => (
                                                        <input
                                                            {...fieldProps}
                                                            type="hidden"
                                                            value={field.value}
                                                        />
                                                    )}
                                                </Field>
                                                <Field
                                                    type="string"
                                                    name={`users.${index()}.userId`}
                                                >
                                                    {(field, fieldProps) => (
                                                        <input type="hidden" {...fieldProps} name={field.name} value={field.value}  />
                                                    )}
                                                </Field>
                                                <Field
                                                    type="string"
                                                    name={`users.${index()}.firstName`}
                                                >
                                                    {(field, fieldProps) => (
                                                        <input type="hidden" {...fieldProps} name={field.name} value={field.value}  />
                                                    )}
                                                </Field>
                                                <Field
                                                    type="string"
                                                    name={`users.${index()}.lastName`}
                                                >
                                                    {(field, fieldProps) => (
                                                        <input type="hidden" {...fieldProps} name={field.name} value={field.value}  />
                                                    )}
                                                </Field>
                                                <hr class="my-[40px] border-t" />
                                                <h4 class="mb-[24px] text-[18px] font-bold md:text-[24px]">{user.firstName} {user.lastName}</h4>
                                                <h5 class="mb-[24px] font-semibold md:text-[18px]">Can you make it?</h5>
                                                <div class="flex justify-center gap-[40px]">
                                                    <Field
                                                        type="string"
                                                        name={`users.${index()}.isComing`}
                                                    >
                                                        {(field, fieldProps) => (
                                                            <>
                                                                <RadioInput
                                                                    {...fieldProps}
                                                                    label="Yes"
                                                                    value="true"
                                                                    checked={field.value === 'true'}
                                                                />
                                                                <RadioInput
                                                                    {...fieldProps}
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
                                                    <h5 class="mb-[24px] font-semibold md:text-[18px]">Do you have any dietary requirements?</h5>
                                                    <div class="flex justify-center gap-[54px]">
                                                        <div class="flex flex-col gap-[24px]">
                                                            <Field type="boolean" name={`users.${index()}.isVegan`}>
                                                                {(field, fieldProps) => (
                                                                    <CheckboxInput {...fieldProps} label="Vegan" name={field.name} checked={field.value} />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.isVegetarian`}>
                                                                {(field, fieldProps) => (
                                                                    <CheckboxInput {...fieldProps} label="Vegetarian" name={field.name} checked={field.value}  />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.noGluten`}>
                                                                {(field, fieldProps) => (
                                                                    <CheckboxInput {...fieldProps} label="No gluten" name={field.name} checked={field.value}  />
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div class="flex flex-col gap-[24px]">
                                                            <Field type="boolean" name={`users.${index()}.noNuts`}>
                                                                {(field, fieldProps) => (
                                                                    <CheckboxInput {...fieldProps} label="No nuts" name={field.name} checked={field.value}  />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.noDairy`}>
                                                                {(field, fieldProps) => (
                                                                    <CheckboxInput {...fieldProps} label="No dairy" name={field.name} checked={field.value}  />
                                                                )}
                                                            </Field>
                                                            <Field type="boolean" name={`users.${index()}.addOther`}>
                                                                {(field, fieldProps) => (
                                                                    <CheckboxInput {...fieldProps} label="Other" name={field.name} checked={field.value}  />
                                                                )}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Show when={getValue(rsvpForm, `users.${index()}.addOther`) === true || Boolean(props.invite.users[index()].other)}>
                                                    <div class="mx-auto w-full max-w-[400px]">
                                                        <Field type="string" name={`users.${index()}.other`}>
                                                            {(field, fieldProps) => (
                                                                <GenericField {...fieldProps} type="text" value={field.value} error={field.error} label="Other dietary requirements" />
                                                            )}
                                                        </Field>
                                                    </div>
                                                </Show>
                                            </Show>
                                            <Show when={Boolean(getValue(rsvpForm, `users.${index()}.isComing`)) && !Boolean(get(props, `invite.users.${index()}.userId`))}>
                                                <div class="mx-auto w-full max-w-[400px]">
                                                    <Field type="string" name={`users.${index()}.email`}>
                                                        {(field, fieldProps) => (
                                                            <GenericField
                                                                {...fieldProps}
                                                                type="email"
                                                                value={field.value}
                                                                error={field.error}
                                                                label="Email address"
                                                                placeholder="email@example.com"
                                                                disabled={props.isSubmitted}
                                                            />
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
