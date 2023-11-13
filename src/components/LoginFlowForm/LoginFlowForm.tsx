import {createSignal, onMount, Ref, Show} from 'solid-js';
import { useSearchParams } from 'solid-start';
import OTPForm from '@components/OTPForm';
import LoginForm from '@components/LoginForm';
import getHost from '@utils/get-host';
import { isRefHTMLElement } from '@utils/is-type';
import { LoginFormProps } from '@components/LoginForm/LoginForm';
import { ErrorCodes } from '@utils/error-codes';
import ErrorMessage from '@components/ErrorMessage';
import APIError from '@errors/APIError';
import {scrollToElement} from '@utils/scroll-to-element';

interface LoginFlowFormProps {
    rsvp: Ref<HTMLElement>;
    onEmailSubmit?: (email: string) => Promise<void> | void;
    onAuthorised?: (redirectUrl: string) => Promise<void> | void;
}

const LoginFlowForm = (props: LoginFlowFormProps) => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ globalError, setGlobalError ] = createSignal<{ text: Array<string> } | null>(null);
    const [ submitted, setSubmitted ] = createSignal<boolean>(false);
    const [ email, setEmail ] = createSignal<string | null>( searchParams.email || null);
    const [ showOPTForm, setShowOPTForm ] = createSignal<boolean>(false);

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
            case '0011':
                setGlobalError({
                    text: ["The email address provided is not linked to the invite found, please try again."]
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

    async function loginOTP(email: string) {
        try {
            if (submitted()) {
                return;
            }

            setSubmitted(true);
            await props.onEmailSubmit?.(email);

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
                    setFormError?.({ code: data.error.code });
                    return;
                }

                throw new Error('Uncaught error during login', data);
            }

            setEmail(email);
            setShowOPTForm(true);
        } catch (err: unknown) {
            if (err instanceof APIError) {
                setFormError?.({ code: err.code });
                return;
            }
            setFormError?.({ code: ErrorCodes.UNKNOWN});
        } finally {
            setSubmitted(false);
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
                setFormError?.({ code: data.error.code });
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

    onMount(() => {
        if (searchParams.error) {
            handleErrorCode(searchParams.error);
        }

        (async () => {
            if (searchParams.email && isRefHTMLElement(props.rsvp)) {
                await loginOTP(searchParams.email);

                setSearchParams({
                    email: undefined
                });

                let offset = 0;
                const rsvpImage = props.rsvp.getElementsByTagName('img')[0];

                if (rsvpImage) {
                    const style = window.getComputedStyle(rsvpImage);
                    offset = rsvpImage.getBoundingClientRect().height + (parseInt(style.marginBottom.replace('px', '')) * 1.5);
                }

                scrollToElement(props.rsvp, {
                    includeHeader: true,
                    offset: offset,
                });
            }
        })();
    })

    return (
        <>
            <Show when={globalError() !== null}>
                <ErrorMessage text={globalError()!.text} />
            </Show>

            <Show when={showOPTForm()}>
                <OTPForm email={email()!} onSubmit={handleOTPSubmit} setFormError={setFormError} />
                <div class="text-center">
                    <a onClick={() => setShowOPTForm(false)} class="mt-2 inline-block cursor-pointer text-gray-600 underline">Use a different email address</a>
                </div>
            </Show>

            <Show when={!showOPTForm()}>
                <LoginForm onSubmit={handleLoginSubmit} setFormError={setFormError} />
            </Show>
        </>
    )
}

export default LoginFlowForm;
