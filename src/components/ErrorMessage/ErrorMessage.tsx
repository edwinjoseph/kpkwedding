import RichText from '@components/RichText';

interface ErrorMessageProps {
    text: string | Array<string>;
}

const ErrorMessage = (props: ErrorMessageProps) => (
    <div class={'px-[16px] py-[12px] mb-4 bg-red-200 text-red-700 text-medium'}>
        <RichText content={Array.isArray(props.text) ? props.text : [ props.text ]} />
    </div>
);

export default ErrorMessage;
