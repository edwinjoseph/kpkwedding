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
    people: z.array(InvitePersonSchema)
});

type InvitePersonType = z.infer<typeof InvitePersonSchema>;
type InviteFormType = z.infer<typeof InviteSchema>;

const PersonCard = (props: {
    isEditingPerson: boolean;
    isEditingMe: boolean,
    person: InvitePersonType | undefined;
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
        <Show when={props.person && !props.isEditingMe}>
            <div class="flex justify-between">
                <p><strong>{props.person!.firstName} {props.person!.lastName}</strong></p>
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
    const [ inviteForm, { Form, Field, FieldArray }] = createForm<InviteFormType>({
        initialValues: {
            people: [{
                firstName: '',
                lastName: '',
            }]
        },
        validate: zodForm(InviteSchema)
    });

    const handleInviteSubmit: SubmitHandler<InviteFormType> = async (formValues) => {
        const response = await fetch(new URL('/api/invite', getHost()).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        });

        if (!response.ok) {
            return;
        }

        setEditPerson(0);
        setSavedPeople([]);
        reset(inviteForm, {
            initialValues: {
                people: [{
                    firstName: '',
                    lastName: '',
                }]
            }
        });
        props.closeModal();
    }

    const handleSavePerson = async (index: number) => {
        // @ts-ignore
        const people: Array<InvitePersonType> = getValues(inviteForm, {
            shouldActive: false,
        }).people;

        const isValid = await validate(inviteForm, 'people')
        const person = people.at(index);

        if (person && isValid) {
            setSavedPeople(previousValue => {
                const newValue = previousValue.slice();
                newValue.splice(index, 1, person);

                return newValue;
            });

            setEditPerson(null);
        }
    }

    const handleEditPerson = async (index: number) => {
        if (editPerson() !== null) {
            const isValid = await validate(inviteForm, 'people');

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

        remove(inviteForm, 'people', {
            at: index
        });

        if (shouldSetDefault) {
            insert(inviteForm, 'people', {
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

        insert(inviteForm, 'people', {
            value: {
                firstName: '',
                lastName: ''
            }
        });

        setEditPerson(index);
    }

    return (
        <Modal isOpen={props.isOpen} closeModal={props.closeModal}>
            <>
                <Modal.Header title="Add an invite" closeModal={props.closeModal} />
                <Modal.Body>
                    <Form onSubmit={handleInviteSubmit}>
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
                        <FieldArray name="people">
                            {(fieldArray) => (
                                <>
                                    <For each={fieldArray.items}>
                                        {(_, index) => (
                                            <PersonCard
                                                isEditingPerson={Boolean(editPerson())}
                                                person={savedPeople().at(index())}
                                                isEditingMe={editPerson() === index()}
                                                onSave={() => handleSavePerson(index())}
                                                onEdit={() => handleEditPerson(index())}
                                                onRemove={() => handleRemovePerson(index())}>
                                                <div class="flex gap-4">
                                                    <Field name={`people.${index()}.firstName`}>
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
                                                    <Field name={`people.${index()}.lastName`}>
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
