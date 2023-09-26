interface LabelErrorProps {
    name: string;
    text: string
}

const LabelError = (props: LabelErrorProps) => (
    <label id={`${props.name}-error`} class="inline-block text-[#F11A41] font-medium mt-1" for={props.name}>{props.text}</label>
);

export default LabelError;
