import { JSX, splitProps } from 'solid-js';
import twcx from '@utils/tailwind-cx';

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
        <div class={twcx('inline-block', props.class)}>
            <label for={id} class="flex cursor-pointer items-center gap-6">
                <div class="relative">
                    <input
                        {...inputProps}
                        type="radio"
                        id={id}
                        class="peer float-left h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[#8D8D8D] bg-white checked:border-0 checked:bg-pink hover:border-pink"
                    />
                    <div class="absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white peer-checked:block" />
                </div>
                <span class="select-none text-[18px]">{props.label}</span>
            </label>
        </div>
    );
}

export default RadioInput;
