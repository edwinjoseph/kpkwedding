import cx from 'classnames';
import { JSX, splitProps } from 'solid-js';

interface GenericInputProps {
    name: string;
    type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
    hasError?: boolean;
    value?: string;
    ref?: (element: HTMLInputElement) => void;
    onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
    onKeyDown?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;
    onChange?: JSX.EventHandler<HTMLInputElement, Event>;
    onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
    class?: string;
    disabled?: boolean,

    inputmode?: "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | "search";
    pattern?: string;
    max?: number | string;
    autocomplete?: string;
    placeholder?: string;
    required?: boolean;
}

const GenericInput = (props: GenericInputProps) => {
    const [, inputProps ] = splitProps(props, ['hasError']);
    return (
        <input
            {...inputProps}
            class={cx('w-full py-[12px] px-[20px] bg-white border border-[#CBCBCB] outline-none focus:border-[#D98E92]', props.class, {
                'border-[#F11A41] focus:border-[#F11A41]': props.hasError,
                'border-[#000]': !!props.value && !props.hasError,
                'pointer-events-none': props.disabled,
            })}
            id={props.name}
            value={props.value || ''}
            aria-invalid={props.hasError}
            aria-errormessage={`${props.name}-error`}
        />
    )
}

export default GenericInput;
