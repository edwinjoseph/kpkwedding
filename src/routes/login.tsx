import { createSignal, onMount, Show } from 'solid-js';
import { A, useSearchParams } from 'solid-start';
import LoginFlowForm from '@components/LoginFlowForm';
import ErrorMessage from '@components/ErrorMessage';

const Login = () => {
    const [ searchParams ] = useSearchParams();
    const [ globalError, setGlobalError ] = createSignal<{ text: Array<string> } | null>(null)

    const handleErrorCode = (errorCode: string) => {
        switch (errorCode) {
            case '0001':
            case '0002':
            case '0003':
            case '0004':
                setGlobalError({
                    text: ["Unable to authenticate session, please try logging in again."]
                });
                break;
            default:
                setGlobalError({
                    text: ['Something went wrong, please try again.']
                });
        }
    }

    const setFormError = (value: { code?: string; text?: Array<string> } | null): void => {
        if (value === null || value.text !== undefined) {
            setGlobalError(value as { text: Array<string> });
            return;
        }

        if (value.code) {
            handleErrorCode(value.code);
            return;
        }
    }

    onMount(() => {
        if (searchParams.error) {
            handleErrorCode(searchParams.error);
        }
    })

    return (
        <>
            <section class="bg-[#e8e8e8] h-screen flex justify-center flex-col px-[16px]">
                <div class="max-w-[400px] w-full mx-auto">
                    <div class="px-[24px] py-[32px] bg-white rounded-md">
                        <Show when={globalError() !== null}>
                            <ErrorMessage text={globalError()!.text} />
                        </Show>

                        <LoginFlowForm setFormError={setFormError} />
                    </div>
                    <A href="/" class="inline-block mt-2">&larr; Back to homepage</A>
                </div>
            </section>
        </>
    );
}

export default Login;
