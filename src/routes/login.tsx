import { createForm, getValue, zodForm } from '@modular-forms/solid';
import { z } from "zod";
import supabase from '@lib/supabase/client';
import GenericField from '@components/GenericField';
import SubmitButton from '@components/SubmitButton/SubmitButton';
import { createSignal } from 'solid-js';
import getHost from '../utils/get-host';

const LoginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

type LoginForm = z.infer<typeof LoginSchema>;

const Login = () => {
    const [ submissionSuccess, setSubmissionSuccess ] = createSignal<boolean | null>(null)
    const [ loginForm, { Form, Field }] = createForm<LoginForm>({
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

            setSubmissionSuccess(true);
        } catch (err) {
            console.error(err);
            setSubmissionSuccess(false);
        }
    }

    const handleFormSubmit = (formValues: LoginForm) => {
        void loginOTP(formValues.email);
    }

    return (
        <>
            <section class="bg-[#e8e8e8] h-screen flex justify-center flex-col px-[16px]">
                <div class="max-w-[400px] w-full mx-auto px-[24px] py-[32px] bg-white">
                    {submissionSuccess() && (
                        <div>
                            An email has been sent to {getValue(loginForm, 'email', { shouldActive: false })} with your login link.
                        </div>
                    )}
                    {submissionSuccess() === null && (
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
            </section>
        </>
    );
}

export default Login;
