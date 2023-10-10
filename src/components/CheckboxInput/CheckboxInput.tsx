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
            <label for={props.name} class="flex gap-6 items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={props.name}
                    class="appearance-none w-6 h-6 border-2 border-[#8D8D8D] rounded bg-white shrink-0 checked:bg-pink checked:border-0 cursor-pointer peer hover:border-pink"
                    {...inputProps}
                />
                <span class="select-none text-[18px]">{props.label}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="absolute w-6 h-6 hidden peer-checked:block">
                    <path d="M5 11.5L9.5 16L18 7.5" stroke="white" stroke-width="2"/>
                </svg>
            </label>
        </div>
    )
};

export default CheckboxInput;
