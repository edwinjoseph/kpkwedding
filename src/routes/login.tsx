import { A } from 'solid-start';
import LoginFlowForm from '@components/LoginFlowForm';

const Login = () => {
    return (
        <>
            <section class="flex h-screen flex-col justify-center bg-[#e8e8e8] px-[16px]">
                <div class="mx-auto w-full max-w-[400px]">
                    <div class="rounded-md bg-white px-[24px] py-[32px]">
                        <LoginFlowForm />
                    </div>
                    <A href="/" class="mt-2 inline-block">&larr; Back to homepage</A>
                </div>
            </section>
        </>
    );
}

export default Login;
