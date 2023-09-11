import {Component} from 'solid-js';
import cx from 'classnames';

const SubmitButton: Component<{ text: string, class?: string }> = ({ text, ...props }) => (
    <button type="submit" class={cx('px-[24px] py-[16px] bg-[#D98E92] uppercase font-bold text-white', props.class)}>{text}</button>
);

export default SubmitButton;
