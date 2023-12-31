import { redirect } from "solid-start/server";
import {
    StartServer,
    createHandler,
    renderAsync,
    Middleware,
} from "solid-start/entry-server";
import superbase from '@lib/supabase/server';
import EmailClient from '@lib/email';
import getHost, { allowedHosts } from '@utils/get-host';

EmailClient.initialize(process.env.SMTP_API_KEY as string);

const enableCors: Middleware = ({ forward }) => async (event) => {
    const url = new URL(event.request.url);
    const response = await forward(event);

    if (url.pathname.startsWith('/api')) {
        if (allowedHosts.includes(url.origin) || allowedHosts.includes(url.host)) {
            response.headers.append('Access-Control-Allow-Origin', getHost());
        }

        response.headers.append('Access-Control-Allow-Credentials', 'true');
        response.headers.append('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        response.headers.append('Cache-Control', 'no-store, max-age=0');
    }

    return response;
}

const handleProtectedPaths: Middleware = ({ forward }) => async (event) => {
    const url = new URL(event.request.url);
    const isLoginRoute = url.pathname === '/login';
    const isAdminRoute = url.pathname.startsWith('/admin');

    if ((!isLoginRoute && !isAdminRoute)) {
        return forward(event);
    }

    const { data } = await superbase(event.request).auth.getSession();
    const isAuthenticated = Boolean(data.session?.access_token);
    const isAdmin = data.session?.user?.app_metadata?.userrole === 'webadmin';

    if (!isAuthenticated && !isLoginRoute) {
        return redirect('/login');
    }

    if (isAuthenticated && isLoginRoute) {
        return redirect(isAdmin ? '/admin' : '/');
    }

    if (isAuthenticated && isAdminRoute && !isAdmin) {
        return redirect('/');
    }

    const response = await forward(event);

    response.headers.append('Cache-Control', 'private, max-age=300, must-revalidate');

    return response;
}

export default createHandler(
    enableCors,
    handleProtectedPaths,
    renderAsync((event) => <StartServer event={event} />)
);
