interface LabelErrorProps {
    name: string;
    text: string
}

const LabelError = (props: LabelErrorProps) => (
    <label id={`${props.name}-error`} class="mt-1 inline-block font-medium text-[#F11A41]" for={props.name}>{props.text}</label>
);

export default LabelError;
