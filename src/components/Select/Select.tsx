import { Component, For, JSX, splitProps } from 'solid-js';
import twcx from '@utils/tailwind-cx';

interface SelectProps {
    name: string;
    options: Array<{ label: string; value: string }>;
    hasError?: boolean;
    value?: string;
    ref?: (element: HTMLSelectElement) => void;
    onInput?: JSX.EventHandler<HTMLSelectElement, InputEvent>;
    onKeyDown?: JSX.EventHandler<HTMLSelectElement, KeyboardEvent>;
    onChange?: JSX.EventHandler<HTMLSelectElement, Event>;
    onBlur?: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
    class?: string;
    disabled?: boolean,
}

const Select: Component<SelectProps> = (props) => {
    const [, selectProps ] = splitProps(props, ['options', 'hasError']);
    return (
        <select
            {...selectProps}
            class={twcx('w-full py-[12px] px-[20px] bg-white border border-[#CBCBCB] outline-none focus:border-[#D98E92]', props.class, {
                'border-[#F11A41] focus:border-[#F11A41]': props.hasError,
                'border-[#000]': !!props.value && !props.hasError,
                'pointer-events-none': props.disabled,
            })}
            id={props.name}
            value={props.value || ''}
            aria-invalid={props.hasError}
            aria-errormessage={`${props.name}-error`}>
            <For each={props.options}>
                {(option) => (
                    <option value={option.value}>{option.label}</option>
                )}
            </For>
        </select>
    )
}

export default Select;
