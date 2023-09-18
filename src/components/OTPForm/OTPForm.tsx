import { onMount, For, createSignal, Setter, JSX } from 'solid-js';
import GenericInput from '@components/GenericInput';
import SubmitButton from '@components/SubmitButton';

export interface OTPFormProps {
    email: string;
    onSubmit: (values: { email: string; code: string; }, event: SubmitEvent) => void;
    onGlobalError: Setter<{ text: Array<string> } | null>
}

const OTPForm = ({ email, onSubmit, onGlobalError }: OTPFormProps) => {
    const [ code, setCode ] = createSignal<Array<string | null>>([...new Array(6)].map(() => null));
    const fields: Array<HTMLInputElement> = [];

    const focus = (index: number) => {
        const el = fields.at(index);

        el!.focus()
    }

    const getValue = (index: number): string | null => {
        const value = code().at(index);

        return value || null;
    }

    const focusOnLastEnabledField = () => {
        let index = code().length - 1;

        while (index !== 0 && code().at(index) === null) {
            index = index - 1;
        }

        focus(Math.max(index - 1, 0));
    }

    const handleOnKeyDown = (index: number) => (event: KeyboardEvent) => {
        if (event.key === 'Tab' || event.key === 'r' && event.metaKey) {
            return;
        }

        if (event.key === 'v' && event.metaKey) {
            return;
        }

        event.preventDefault();

        if (event.key === 'Backspace') {
            if (fields.at(index)!.value) {
                fields.at(index)!.value = '';
                setCode(oldCode => {
                    const newCode = oldCode.slice()
                    newCode.splice(index, 1, null)
                    return newCode;
                });
                focus(index);
                return;
            }
            if (index !== 0) {
                console.log(index - 1);
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

            // @ts-ignore
            if (document.activeElement && !fields.includes(document.activeElement)) {
                return;
            }

            onGlobalError(null);

            const code = ((event as ClipboardEvent).clipboardData)
                ?.getData("text")
                ?.replaceAll('\n', '').split('') || [];

            if (code.length !== 6) {
                onGlobalError({
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
        <form onsubmit={handleSubmit}>
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
                                    class="py-0 px-0 aspect-[1/1] text-center"
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
