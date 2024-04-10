import { redirect } from "@sveltejs/kit";
import { lucia } from "$lib/database/auth.server";

// export const handle: Handle = async ({ event, resolve }) => {
// 	// get session id from cookies
// 	const sessionId = event.cookies.get(lucia.sessionCookieName);

// 	// if no session id, set user and sesssion to null and resolve request
// 	if (!sessionId) {
// 		event.locals.user = null;
// 		event.locals.session = null;
// 		return resolve(event);
// 	}
// };

export async function handle({ event, resolve }) {
	// get session id from cookies
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	// if no session id, set user and sesssion to null and resolve request
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	// Attempt to validate the session using the retrieved session ID
	const { session, user } = await lucia.validateSession(sessionId);

	// If the session is newly created (due to session expiration extension), generate a new session cookie
	if (session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);

		// Set the new session cookie in the browser
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}

	// If the session is invalid, generate a blank session cookie to remove the existing session cookie from the browser
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}

	const AUTH_ROUTES = ["/auth/login", "/auth/register"];
	const DASHBOARD_ROUTE = "/dashboard";
	// If a user is logged in and attempts to access the login or register page, redirect them to the dashboard
	if (session && AUTH_ROUTES.includes(event.url.pathname)) {
		throw redirect(303, DASHBOARD_ROUTE);
	}

	// Persist the user and session information in the event locals for use within endpoint handlers and page components
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
}
