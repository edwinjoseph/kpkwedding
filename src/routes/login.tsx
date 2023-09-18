import {createSignal, onMount, Show} from 'solid-js';
import { A, useSearchParams } from 'solid-start';
import getHost from '../utils/get-host';
import RichText from '@components/RichText';
import LoginForm, {LoginFormProps} from '@components/LoginForm/LoginForm';
import OTPForm from '@components/OTPForm';

const Login = () => {
    const [ searchParams ] = useSearchParams();
    const [ email, setEmail ] = createSignal<string | null>(null);
    const [ globalError, setGlobalError ] = createSignal<{ text: Array<string> } | null>(null)
    const [ showOPTForm, setShowOPTForm ] = createSignal<boolean>(false);

    async function loginOTP(email: string) {
        try {
            const response = await fetch(new URL('/api/auth/login', getHost()).toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data?.error?.code) {
                    handleErrorCode(data.error.code);
                    return;
                }

                throw new Error('Uncaught error during login', data);
            }

            setEmail(email);
            setShowOPTForm(true);
        } catch (err: unknown) {
            handleErrorCode('9999');
        }
    }

    const verifyOTP = async (email: string, code: string) => {
        const response = await fetch(new URL('/api/auth/confirm', getHost()).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code })
        });

        const data = await response.json();

        if (!response.ok) {
            if (data?.error?.code) {
                handleErrorCode(data.error.code);
                return;
            }
        }

        const redirectTo = response.headers.get('Location');

        if (redirectTo) {
            window.location.assign(redirectTo);
        }
    }

    const handleLoginSubmit: LoginFormProps['onSubmit'] = (formValues) => {
        void loginOTP(formValues.email);
    }

    const handleOTPSubmit = (formValues: { email: string; code: string; }) => {
        void verifyOTP(formValues.email, formValues.code);
    }

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
                            <div class={'px-[16px] py-[12px] mb-4 bg-red-200 text-red-700 text-medium'}>
                                <RichText content={globalError()!.text} />
                            </div>
                        </Show>

                        <Show when={showOPTForm()}>
                            <OTPForm email={email()!} onSubmit={handleOTPSubmit} onGlobalError={setGlobalError} />
                            <div class="text-center">
                                <a onClick={() => setShowOPTForm(false)} class="inline-block text-gray-600 mt-2 underline cursor-pointer">Use a different email address</a>
                            </div>
                        </Show>

                        <Show when={!showOPTForm()}>
                            <LoginForm onSubmit={handleLoginSubmit} onGlobalError={setGlobalError} />
                        </Show>
                    </div>
                    <A href="/" class="inline-block mt-2">&larr; Back to homepage</A>
                </div>
            </section>
        </>
    );
}

export default Login;
