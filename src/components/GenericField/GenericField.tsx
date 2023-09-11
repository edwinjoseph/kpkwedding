import { Component, JSX } from 'solid-js';

type GenericFieldProps = {
    name: string;
    type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
    label?: string;
    placeholder?: string;
    value: string | undefined;
    error: string;
    required?: boolean;
    ref: (element: HTMLInputElement) => void;
    onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
    onChange: JSX.EventHandler<HTMLInputElement, Event>;
    onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

const GenericField: Component<GenericFieldProps> = ({ value, label, error, ...props }) => (
    <div>
        {label && (
            <label for={props.name} class="inline-block font-semibold mb-[16px] md:text-[18px]">
                {label}
            </label>
        )}
        <input
            {...props}
            class="w-full py-[12px] px-[20px] border border-[#CBCBCB] outline-none	 focus:border-[#D98E92]"
            id={props.name}
            value={value || ''}
            aria-invalid={!!error}
            aria-errormessage={`${props.name}-error`}
        />
        {error && <div id={`${props.name}-error`}>{error}</div>}
    </div>
);

export default GenericField;
