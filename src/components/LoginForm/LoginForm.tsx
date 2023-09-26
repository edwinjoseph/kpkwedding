import { createEffect } from 'solid-js';
import { createForm, zodForm, SubmitHandler, getValue } from '@modular-forms/solid';
import { z } from 'zod';
import GenericField from '@components/GenericField';
import SubmitButton from '@components/SubmitButton';

const LoginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

type LoginFormType = z.infer<typeof LoginSchema>;

export interface LoginFormProps {
    onSubmit: SubmitHandler<LoginFormType>;
    setFormError?: (value: { code?: string; text?: Array<string> } | null) => void
}

const LoginForm = (props: LoginFormProps) => {
    const [ loginForm, { Form, Field } ] = createForm<LoginFormType>({
        validateOn: 'blur',
        validate: zodForm(LoginSchema)
    });

    createEffect(() => {
        if (getValue(loginForm, 'email', { shouldActive: false })) {
            props.setFormError?.(null);
        }
    });

    return (
        <Form onSubmit={props.onSubmit} data-form-type="login">
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
    )
}

export default LoginForm;
