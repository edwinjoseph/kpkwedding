import { splitProps, JSX } from "solid-js";
import cx from 'classnames';

interface CheckboxInputProps {
    name: string;
    label: string;
    class?: string;
    value?: string;
    checked?: boolean;
    ref?: (element: HTMLInputElement) => void;
    onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
    onKeyDown?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;
    onChange?: JSX.EventHandler<HTMLInputElement, Event>;
    onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
    disabled?: boolean,
    required?: boolean;
}

const CheckboxInput = (props: CheckboxInputProps) => {
    const [, inputProps ] = splitProps(props, ['class', 'label']);
    return (
        <div class={cx('inline-block', props.class)}>
            <label for={props.name} class="flex cursor-pointer items-center gap-6">
                <input
                    type="checkbox"
                    id={props.name}
                    class="peer h-6 w-6 shrink-0 cursor-pointer appearance-none rounded border-2 border-[#8D8D8D] bg-white checked:border-0 checked:bg-pink hover:border-pink"
                    {...inputProps}
                />
                <span class="select-none text-[18px]">{props.label}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="absolute hidden h-6 w-6 peer-checked:block">
                    <path d="M5 11.5L9.5 16L18 7.5" stroke="white" stroke-width="2"/>
                </svg>
            </label>
        </div>
    )
};

export default CheckboxInput;
