import {Component} from 'solid-js';
import cx from 'classnames';

const SubmitButton: Component<{ text: string, class?: string; alt?: boolean, onClick?: () => any | Promise<any> }> = (props) => (
    <button
        type={props.onClick ? 'button' : 'submit'}
        class={cx('px-[24px] py-[16px] uppercase font-bold outline-none ', {
            'bg-pink text-white hover:bg-pink-dark focus:bg-pink-dark': !props.alt,
            'border-[2px] border-pink text-pink hover:border-pink-dark hover:text-pink-dark focus:border-pink-dark focus:text-pink-dark': props.alt,
        }, props.class)}
        onClick={props.onClick}>
        {props.text}
    </button>
);

export default SubmitButton;
