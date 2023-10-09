import { JSX, splitProps } from 'solid-js';
import cx from 'classnames';

interface RadioInputProps {
    name: string;
    value: string;
    label: string;
    checked?: boolean;
    class?: string;
    ref?: (element: HTMLInputElement) => void;
    onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
    onKeyDown?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;
    onChange?: JSX.EventHandler<HTMLInputElement, Event>;
    onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
    disabled?: boolean,
    required?: boolean;
}

const RadioInput = (props: RadioInputProps) => {
    const [, inputProps] = splitProps(props, ['label', 'class']);
    const id = `${props.name}:${props.value}`;

    return (
        <div class={cx('inline-block', props.class)}>
            <label for={id} class="flex gap-6 items-center cursor-pointer">
                <div class="relative">
                    <input
                        {...inputProps}
                        type="radio"
                        id={id}
                        class="appearance-none w-6 h-6 border-2 border-[#8D8D8D] rounded-full bg-white shrink-0 float-left checked:bg-pink checked:border-0 cursor-pointer peer hover:border-pink"
                    />
                    <div class="absolute w-2 h-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden peer-checked:block bg-white rounded-full" />
                </div>
                <span class="select-none text-[18px]">{props.label}</span>
            </label>
        </div>
    );
}

export default RadioInput;
