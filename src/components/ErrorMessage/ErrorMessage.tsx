import RichText from '@components/RichText';

interface ErrorMessageProps {
    text: string | Array<string>;
}

const ErrorMessage = (props: ErrorMessageProps) => (
    <div class={'mb-4 bg-red-200 px-[16px] py-[12px] font-medium text-red-700'}>
        <RichText content={Array.isArray(props.text) ? props.text : [ props.text ]} />
    </div>
);

export default ErrorMessage;
