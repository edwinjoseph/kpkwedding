import { onMount, For, createSignal, JSX } from 'solid-js';
import { isHTMLInputElement } from '@utils/is-type';
import GenericInput from '@components/GenericInput';
import SubmitButton from '@components/SubmitButton';

export interface OTPFormProps {
    email: string;
    onSubmit: (values: { email: string; code: string; }, event: SubmitEvent) => void;
    setFormError?: (value: { code?: string; text?: Array<string> } | null) => void
}

const OTPForm = ({ email, onSubmit, setFormError }: OTPFormProps) => {
    const [ code, setCode ] = createSignal<Array<string | null>>([null, null, null, null, null, null]);
    const fields: Array<HTMLInputElement> = [];

    const focus = (index: number) => {
        const el = fields[index];

        el!.focus()
    }

    const getValue = (index: number): string | null => {
        const value = code()[index];

        return value || null;
    }

    const focusOnLastEnabledField = () => {
        let index = code().length - 1;

        while (index !== 0 && code()[index] === null) {
            index = index - 1;
        }

        focus(Math.max(index - 1, 0));
    }

    const handleOnKeyDown = (index: number) => (event: KeyboardEvent) => {
        if (event.key === 'Tab' || event.key === 'r' && event.metaKey) {
            return;
        }

        if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
            return;
        }

        event.preventDefault();

        if (event.key === 'Backspace') {
            if (fields[index]!.value) {
                fields[index]!.value = '';
                setCode(oldCode => {
                    const newCode = oldCode.slice()
                    newCode.splice(index, 1, null)
                    return newCode;
                });
                focus(index);
                return;
            }
            if (index !== 0) {
                setCode(oldCode => {
                    const newCode = oldCode.slice()
                    newCode.splice(index - 1, 1, null)
                    return newCode;
                });
                focus(index - 1);
                return;
            }
        }

        if (event.key.match(/[0-9]{1}/) === null) {
            return;
        }

        setCode(oldCode => {
            const newCode = oldCode.slice()
            newCode.splice(index, 1, event.key)
            return newCode;
        });

        focus(Math.min(index + 1, 5));
    }


    onMount(() => {
        document.addEventListener("paste", (event) => {
            event.preventDefault();

            if (isHTMLInputElement(document.activeElement) && !fields.includes(document.activeElement)) {
                return;
            }

            setFormError?.(null);

            const code = ((event as ClipboardEvent).clipboardData)
                ?.getData("text")
                ?.replaceAll('\n', '').split('') || [];

            if (code.length !== 6) {
                setFormError?.({
                    text: [`The code "${code.join('')}" doesn't look correct, please double check what you copied`],
                });
                return;
            }

            setCode(code);
            focus(5);
        });
    });

    const handleSubmit: JSX.EventHandler<HTMLFormElement, Event & { submitter: HTMLElement; }> = (event) => {
        event.preventDefault();

        return onSubmit({ email, code: code().join('') }, event)
    }

    return (
        <form onsubmit={handleSubmit} data-form-type="otp">
            <p class="mb-4">A one time code has been sent to <strong>"{email}"</strong></p>

            <div class="grid grid-cols-6 gap-1 md:gap-2">
                <For each={code()}>
                    {(value, index) => {
                        const disabled = () => index() !== 0 && getValue(index() - 1) === null;
                        return (
                            <div onClick={disabled() ? focusOnLastEnabledField : undefined}>
                                <GenericInput
                                    ref={ref => fields[index()] = ref}
                                    type="text"
                                    name={`code.${index() + 1}`}
                                    value={value || undefined}
                                    onKeyDown={handleOnKeyDown(index())}
                                    disabled={disabled()}
                                    inputmode="numeric"
                                    pattern="[0-9]"
                                    max={1}
                                    class="aspect-[1/1] p-0 text-center"
                                    autocomplete="off"
                                />
                            </div>
                        );
                    }}
                </For>
            </div>
            <SubmitButton text="Verify code" class="mt-[24px] w-full" />
        </form>
    )
}

export default OTPForm;
