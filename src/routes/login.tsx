import { A } from 'solid-start';
import LoginFlowForm from '@components/LoginFlowForm';

const Login = () => {
    return (
        <>
            <section class="bg-[#e8e8e8] h-screen flex justify-center flex-col px-[16px]">
                <div class="max-w-[400px] w-full mx-auto">
                    <div class="px-[24px] py-[32px] bg-white rounded-md">
                        <LoginFlowForm />
                    </div>
                    <A href="/" class="inline-block mt-2">&larr; Back to homepage</A>
                </div>
            </section>
        </>
    );
}

export default Login;
