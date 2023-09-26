import { createSignal, Show } from 'solid-js';
import OTPForm from '@components/OTPForm';
import LoginForm from '@components/LoginForm';
import getHost from '@utils/get-host';
import { LoginFormProps } from '@components/LoginForm/LoginForm';
import { ErrorCodes } from '@utils/error-codes';

interface LoginFlowFormProps {
    setFormError?: (value: { code?: string; text?: Array<string> } | null) => void,
    onAuthorised?: (redirectUrl: string) => void;
}

const LoginFlowForm = (props: LoginFlowFormProps) => {
    const [ email, setEmail ] = createSignal<string | null>(null);
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
                    props.setFormError?.({ code: data.error.code });
                    return;
                }

                throw new Error('Uncaught error during login', data);
            }

            setEmail(email);
            setShowOPTForm(true);
        } catch (err: unknown) {
            props.setFormError?.({ code: ErrorCodes.UNKNOWN});
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
                props.setFormError?.({ code: data.error.code });
                return;
            }
        }


        const redirectTo = response.headers.get('Location');

        if (!redirectTo) {
            return;
        }

        if (!props.onAuthorised) {
            window.location.assign(redirectTo);
            return;
        }

        props.onAuthorised?.(redirectTo);
    }

    const handleLoginSubmit: LoginFormProps['onSubmit'] = (formValues) => {
        void loginOTP(formValues.email);
    }

    const handleOTPSubmit = (formValues: { email: string; code: string; }) => {
        void verifyOTP(formValues.email, formValues.code);
    }

    return (
        <>
            <Show when={showOPTForm()}>
                <OTPForm email={email()!} onSubmit={handleOTPSubmit} setFormError={props.setFormError} />
                <div class="text-center">
                    <a onClick={() => setShowOPTForm(false)} class="inline-block text-gray-600 mt-2 underline cursor-pointer">Use a different email address</a>
                </div>
            </Show>

            <Show when={!showOPTForm()}>
                <LoginForm onSubmit={handleLoginSubmit} setFormError={props.setFormError} />
            </Show>
        </>
    )
}

export default LoginFlowForm;
