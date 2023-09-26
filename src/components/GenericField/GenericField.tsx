import { splitProps, Component, JSX, Show } from 'solid-js';
import GenericInput from '@components/GenericInput';
import LabelError from '@components/LabelError';

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
    class?: string;
};

const GenericField: Component<GenericFieldProps> = (props) => {
    const [, inputProps ] = splitProps(props, ['label', 'error']);

    return (
        <div class={props.class}>
            <Show when={props.label}>
                <label for={props.name} class="inline-block font-semibold mb-[16px] md:text-[18px]">
                    {props.label}
                </label>
            </Show>
            <GenericInput
                {...inputProps}
                hasError={!!props.error}
            />
            <Show when={props.error}>
                <LabelError name={props.name} text={props.error} />
            </Show>
        </div>
    );
}

export default GenericField;
