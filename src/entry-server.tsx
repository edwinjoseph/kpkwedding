import { redirect } from "solid-start/server";
import {
    StartServer,
    createHandler,
    renderAsync,
    Middleware,
} from "solid-start/entry-server";
import superbase from '@lib/supabase/server';

const handleProtectedPaths: Middleware = ({ forward }) => async (event) => {
    const url = new URL(event.request.url);
    const isLoginRoute = url.pathname === '/login';
    const isAdminRoute = url.pathname.startsWith('/admin');

    if (!isLoginRoute && !isAdminRoute) {
        return forward(event);
    }

    const { data } = await superbase(event.request).auth.getSession();
    const isAuthenticated = Boolean(data.session?.access_token);

    if (isLoginRoute && isAuthenticated) {
        return redirect('/admin');
    }

    if (isAdminRoute && !isAuthenticated) {
        return redirect('/login');
    }

    return forward(event);
}

export default createHandler(
    handleProtectedPaths,
    renderAsync((event) => <StartServer event={event} />)
);
