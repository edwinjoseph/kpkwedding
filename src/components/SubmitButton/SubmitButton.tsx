import {Component} from 'solid-js';
import cx from 'classnames';

const SubmitButton: Component<{ text: string, class?: string; alt?: boolean, small?: boolean, onClick?: () => any | Promise<any> }> = (props) => (
    <button
        type={props.onClick ? 'button' : 'submit'}
        class={cx('px-[24px] uppercase font-bold outline-none tracking-[3.2px]', {
            'bg-pink text-white hover:bg-pink-dark focus:bg-pink-dark py-[16px]': !props.alt,
            'border-[2px] border-pink text-pink hover:border-pink-dark hover:text-pink-dark focus:border-pink-dark focus:text-pink-dark py-[14px]': props.alt,
            'tracking-[2.8px] text-[14px]': props.small,
        }, props.class)}
        onClick={props.onClick}>
        {props.text}
    </button>
);

export default SubmitButton;
