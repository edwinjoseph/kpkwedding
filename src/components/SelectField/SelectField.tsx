import { Component, JSX, splitProps } from 'solid-js';
import Select from '@components/Select';

interface SelectFieldProps {
    name: string;
    options: Array<{ label: string; value: string }>;
    label?: string;
    placeholder?: string;
    value?: string;
    error?: string;
    required?: boolean;
    ref: (element: HTMLSelectElement) => void;
    onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
    onChange: JSX.EventHandler<HTMLSelectElement, Event>;
    onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
}

const SelectField: Component<SelectFieldProps> = (props) => {
    const [, inputProps] = splitProps(props, ['label', 'error']);

    return (
        <div>
            {props.label && (
                <label for={props.name} class="mb-[16px] inline-block font-semibold md:text-[18px]">
                    {props.label}
                </label>
            )}
            <Select
                {...inputProps}
                hasError={!!props.error}
            />
            {props.error && <div id={`${props.name}-error`} class="mt-1 font-medium text-[#F11A41]">{props.error}</div>}
        </div>
    );
}

export default SelectField;
