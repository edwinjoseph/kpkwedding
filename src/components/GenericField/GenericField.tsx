import { splitProps, Component, JSX } from 'solid-js';
import cx from 'classnames';
import GenericInput from '@components/GenericInput';

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

const GenericField: Component<GenericFieldProps> = (props) => {
    const [, inputProps ] = splitProps(props, ['label', 'error']);

    return (
        <div>
            {props.label && (
                <label for={props.name} class="inline-block font-semibold mb-[16px] md:text-[18px]">
                    {props.label}
                </label>
            )}
            <GenericInput
                {...inputProps}
                hasError={!!props.error}
            />
            {props.error && <div id={`${props.name}-error`} class="text-[#F11A41] font-medium mt-1">{props.error}</div>}
        </div>
    );
}

export default GenericField;
