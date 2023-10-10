import Modal from '@components/Modal';
import { z } from 'zod';
import {
    createForm,
    getValues,
    insert,
    remove,
    reset,
    SubmitHandler,
    validate,
    zodForm
} from '@modular-forms/solid';
import getHost from '@utils/get-host';
import SelectField from '@components/SelectField';
import SubmitButton from '@components/SubmitButton';
import { createSignal, For, JSXElement, Show } from 'solid-js';
import GenericField from '@components/GenericField';
import cx from 'classnames';
import { refetchRouteData } from 'solid-start';
import {ErrorCodes} from '@utils/error-codes';

interface InviteModalProps {
    isOpen: boolean;
    closeModal: () => boolean;
}

enum InvitedTo {
  CEREMONY = 'CEREMONY',
  RECEPTION = 'RECEPTION'
}

const InvitePersonSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2)
});

const InviteSchema = z.object({
    invitedTo: z.nativeEnum(InvitedTo),
    users: z.array(InvitePersonSchema)
});

type InvitePersonType = z.infer<typeof InvitePersonSchema>;
type InviteFormType = z.infer<typeof InviteSchema>;

const PersonCard = (props: {
    isEditingPerson: boolean;
    isEditingMe: boolean,
    user: InvitePersonType | undefined;
    onSave: () => void;
    onEdit: () => void;
    onRemove: () => void;
    children: JSXElement,
}) => (
    <div class="my-[16px]">
        <div class={cx({
            'hidden': !props.isEditingMe
        })}>
            {props.children}
            <SubmitButton text="Save" class="mt-[16px] w-full" onClick={props.onSave} />
        </div>
        <Show when={props.user && !props.isEditingMe}>
            <div class="flex justify-between">
                <p><strong>{props.user!.firstName} {props.user!.lastName}</strong></p>
                <Show when={!props.isEditingPerson}>
                    <div class="flex gap-2">
                        <button type="button" onClick={props.onEdit}>Edit</button>
                        <button type="button" onClick={props.onRemove}>Remove</button>
                    </div>
                </Show>
            </div>
        </Show>
    </div>
);

const InviteModal = (props: InviteModalProps) => {
    const [ editPerson, setEditPerson ] = createSignal<number | null>(0);
    const [ savedPeople, setSavedPeople ] = createSignal<Array<InvitePersonType>>([]);
    const [ errorMessage, setErrorMessage ] = createSignal<string | null>(null);
    const [ inviteForm, { Form, Field, FieldArray }] = createForm<InviteFormType>({
        initialValues: {
            invitedTo: undefined,
            users: [{
                firstName: '',
                lastName: '',
            }]
        },
        validate: zodForm(InviteSchema)
    });

    const resetForm = () => {
        reset(inviteForm, {
            initialValues: {
                invitedTo: undefined,
                users: [{
                    firstName: '',
                    lastName: '',
                }]
            }
        });
    }

    const onCloseModal = () => {
        resetForm();
        props.closeModal();
    }

    const handleInviteSubmit: SubmitHandler<InviteFormType> = async (formValues) => {
        const response = await fetch(new URL('/api/invites', getHost()).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        });

        if (!response.ok) {
            const { error } = await response.json();
            switch (error.code) {
                case ErrorCodes.INVITE_USER_EXISTS:
                    setErrorMessage("Unable to add already existing person");
                    break;
                default:
                    setErrorMessage('Something went wrong, please try again.');
                    break;
            }
            return;
        }

        setEditPerson(0);
        setSavedPeople([]);
        await refetchRouteData(['invites']);
        onCloseModal();
    }

    const handleSavePerson = async (index: number) => {
        const isValid = await validate(inviteForm, 'users');

        if (!isValid) {
            return;
        }

        const users = getValues(inviteForm, {
            shouldActive: false,
        }).users;

        if (!users) {
            return;
        }

        const user = users[index] as InvitePersonType;

        if (user && isValid) {
            setSavedPeople(previousValue => {
                const newValue = previousValue.slice();
                newValue.splice(index, 1, user);

                return newValue;
            });

            setEditPerson(null);
        }
    }

    const handleEditPerson = async (index: number) => {
        if (editPerson() !== null) {
            const isValid = await validate(inviteForm, 'users');

            if (!isValid) {
                return;
            }
        }

        setEditPerson(index)
    }

    const handleRemovePerson = async (index: number) => {
        let shouldSetDefault = false

        setSavedPeople(previousValue => {
            const newValue = previousValue.slice();
            newValue.splice(index, 1);

            if (newValue.length === 0){
                shouldSetDefault = true;
            }

            return newValue;
        });

        remove(inviteForm, 'users', {
            at: index
        });

        if (shouldSetDefault) {
            insert(inviteForm, 'users', {
                value: {
                    firstName: '',
                    lastName: ''
                }
            });

            setEditPerson(index);
        }
    }

    const handleAddPerson = async () => {
        const index = savedPeople().length;

        insert(inviteForm, 'users', {
            value: {
                firstName: '',
                lastName: ''
            }
        });

        setEditPerson(index);
    }

    return (
        <Modal isOpen={props.isOpen} closeModal={onCloseModal}>
            <>
                <Modal.Header title="Add an invite" closeModal={onCloseModal} />
                <Modal.Body>
                    <Form onSubmit={handleInviteSubmit}>
                        <Show when={errorMessage() !== null}>
                            <div class="mb-[16px] bg-red-200 px-[16px] py-[12px]">
                                {errorMessage()}
                            </div>
                        </Show>
                        <Field name="invitedTo">
                            {(field, props) => (
                                <SelectField
                                    {...props}
                                    options={Object.values(InvitedTo).map(value => ({
                                        label: value === InvitedTo.RECEPTION ? 'Reception' : 'Ceremony',
                                        value,
                                    }))}
                                    label="What time are they coming"
                                    value={field.value}
                                    error={field.error}
                                    required
                                />
                            )}
                        </Field>
                        <FieldArray name="users">
                            {(fieldArray) => (
                                <>
                                    <For each={fieldArray.items}>
                                        {(_, index) => (
                                            <PersonCard
                                                isEditingPerson={Boolean(editPerson())}
                                                user={savedPeople()[index()]}
                                                isEditingMe={editPerson() === index()}
                                                onSave={() => handleSavePerson(index())}
                                                onEdit={() => handleEditPerson(index())}
                                                onRemove={() => handleRemovePerson(index())}>
                                                <div class="flex gap-4">
                                                    <Field name={`users.${index()}.firstName`}>
                                                        {(field, props) => (
                                                            <GenericField
                                                                {...props}
                                                                type="text"
                                                                label="First name"
                                                                placeholder="First name"
                                                                value={field.value}
                                                                error={field.error}
                                                                required
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`users.${index()}.lastName`}>
                                                        {(field, props) => (
                                                            <GenericField
                                                                {...props}
                                                                type="text"
                                                                label="Last name"
                                                                placeholder="Last name"
                                                                value={field.value}
                                                                error={field.error}
                                                                required
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                            </PersonCard>
                                        )}
                                    </For>
                                </>
                            )}
                        </FieldArray>
                        <div class="flex flex-col gap-4">
                            <Show when={editPerson() === null && savedPeople().length < 2}>
                                <SubmitButton text="Add person" onClick={handleAddPerson} class="mt-[16px] w-full" alt />
                            </Show>
                            <Show when={editPerson() === null}>
                                <SubmitButton text="Create invite" class="w-full" />
                            </Show>
                        </div>
                    </Form>
                </Modal.Body>
            </>
        </Modal>
    );
}
export default InviteModal;
