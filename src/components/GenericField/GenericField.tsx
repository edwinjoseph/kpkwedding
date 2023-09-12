import { splitProps, Component, JSX } from 'solid-js';
import cx from 'classnames';

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
            <input
                {...inputProps}
                class={cx('w-full py-[12px] px-[20px] bg-white border border-[#CBCBCB] outline-none focus:border-[#D98E92]', {
                    'border-[#F11A41] focus:border-[#F11A41]': !!props.error,
                    'border-[#000]': !!props.value && !props.error,
                })}
                id={props.name}
                value={props.value || ''}
                aria-invalid={!!props.error}
                aria-errormessage={`${props.name}-error`}
            />
            {props.error && <div id={`${props.name}-error`} class="text-[#F11A41] font-medium mt-1">{props.error}</div>}
        </div>
    );
}

export default GenericField;
