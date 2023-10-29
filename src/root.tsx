// @refresh reload
import { Suspense } from "solid-js";
import { useLocation } from '@solidjs/router';
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
import { HttpHeader } from "solid-start/server";
import * as Sentry from '@sentry/browser';
import getHost from '@utils/get-host';
import Section from '@components/Section';
import SubmitButton from '@components/SubmitButton';
import "./root.css";

Sentry.init({
    dsn: "https://d03f2ab62d9dd1c88df40ac6a16c5260@o4506021518245888.ingest.sentry.io/4506021530173440",
    maxBreadcrumbs: 50,
    debug: false,
    enabled: process.env.NODE_ENV === 'production'
});

export default function Root() {
    const location = useLocation();
    return (
        <Html lang="en">
            <HttpHeader name="Strict-Transport-Security" value="max-age=63072000; includeSubDomains; preload;" />
            <HttpHeader name="X-Frame-Options" value="DENY" />
            <HttpHeader name="X-Content-Type-Options" value="DENY" />
            <Head>
                <Title>Kezia & James | The Wedding</Title>
                <Meta charset="utf-8"/>
                <Link rel="icon" type="image/png" href="/favicon.png" sizes="16x16" />
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
                <Meta name="theme-color" content="#FFFFFF"/>
                <Meta name="referrer" content={new URL(location.pathname, getHost()).toString()} />
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
