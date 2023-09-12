import { createEffect, createSignal } from 'solid-js';
import { A } from 'solid-start';
import { z } from "zod";
import { createForm, getValue, zodForm } from '@modular-forms/solid';
import getHost from '../utils/get-host';
import supabase from '@lib/supabase/client';
import GenericField from '@components/GenericField';
import SubmitButton from '@components/SubmitButton/SubmitButton';
import RichText from '@components/RichText';

const LoginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

type LoginForm = z.infer<typeof LoginSchema>;

const Login = () => {
    const [ submissionNotification, setSubmissionNotification ] = createSignal<{ text: Array<string>; type: 'success' | 'error' } | null>(null)
    const [ loginForm, { Form, Field }] = createForm<LoginForm>({
        validateOn: 'blur',
        validate: zodForm(LoginSchema)
    });

    async function loginOTP(email: string) {
        try {
            const {error} = await supabase().auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: getHost()
                }
            });

            if (error) {
                throw error;
            }

            setSubmissionNotification({
                type: 'success',
                text: ['# Check your email', `We’ve emailed a one-time link to **${email}**.`, 'If you don’t see the email in your inbox, check your spam folder']
            });
        } catch (err: unknown) {
            let message = ['Something went wrong when logging in.']

            if (err instanceof Error) {
                switch (true) {
                    case err.message === 'Signups not allowed for this instance': {
                        message = ["Sorry, but we're no longer accepting new accounts"];
                        break;
                    }
                    default: {
                        console.error(err);
                    }
                }
            }

            setSubmissionNotification({
                type: 'error',
                text: message
            });
        }
    }

    createEffect(() => {
        if (getValue(loginForm, 'email', { shouldActive: false })) {
            setSubmissionNotification(null);
        }
    })

    const handleFormSubmit = (formValues: LoginForm) => {
        void loginOTP(formValues.email);
    }

    return (
        <>
            <section class="bg-[#e8e8e8] h-screen flex justify-center flex-col px-[16px]">
                <div class="max-w-[400px] w-full mx-auto">
                    <div class="px-[24px] py-[32px] bg-white">
                        {submissionNotification() !== null && (
                            <div class={submissionNotification()!.type === 'error' ? 'px-[16px] py-[12px] mb-4 bg-red-200 text-red-700 text-medium' : ''}>
                                <RichText content={submissionNotification()!.text} />
                            </div>
                        )}

                        {submissionNotification()?.type !== 'success' && (
                            <Form onSubmit={handleFormSubmit}>
                                <Field name="email">
                                    {(field, props) => (
                                        <GenericField
                                            {...props}
                                            type="email"
                                            label="Enter your email address"
                                            placeholder="Email address"
                                            value={field.value}
                                            error={field.error}
                                            required
                                        />
                                    )}
                                </Field>
                                <SubmitButton text="Login" class="mt-[24px] w-full" />
                            </Form>
                        )}
                    </div>
                    <A href="/" class="inline-block mt-2">&larr; Back to homepage</A>
                </div>
            </section>
        </>
    );
}

export default Login;
