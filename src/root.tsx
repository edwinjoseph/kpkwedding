// @refresh reload
import {Suspense} from "solid-js";
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Meta,
    Routes,
    Scripts,
    Title,
    Link,
} from "solid-start";
import * as Sentry from '@sentry/browser';

import "./root.css";
import Section from '@components/Section';
import SubmitButton from '@components/SubmitButton';

Sentry.init({
    dsn: "https://d03f2ab62d9dd1c88df40ac6a16c5260@o4506021518245888.ingest.sentry.io/4506021530173440",
    maxBreadcrumbs: 50,
    debug: false,
    enabled: process.env.NODE_ENV === 'production'
});

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>Kezia & James | The Wedding</Title>
                <Meta charset="utf-8"/>
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
                <Meta name="theme-color" content="#FFFFFF"/>
                <Link rel="preconnect" href="https://fonts.googleapis.com"/>
                <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
                <Link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@900&display=swap"
                    rel="stylesheet"/>
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary fallback={(e: Error) => {
                        Sentry.captureException(e, {
                            level: 'error',

                        });

                        return (
                            <Section>
                                <Section.Container>
                                    <div class="mx-auto max-w-[600px] text-center">
                                        <Section.Title text="Whoops, something went wrong!"
                                                       class="mb-[20px] md:mb-[20px]" centered/>
                                        <p class="mb-[20px]">We're sorry you were unable to complete what you were
                                            doing. We are looking into the issue and will try to resolve this as soon as
                                            we can.</p>
                                        <SubmitButton text="Reload and retry" onClick={() => window.location.reload()}/>
                                    </div>
                                </Section.Container>
                            </Section>
                        )
                    }}>
                        <Routes>
                            <FileRoutes/>
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <Scripts/>
            </Body>
        </Html>
    );
}
