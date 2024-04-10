import { fail, redirect, type Actions } from "@sveltejs/kit";

import { lucia } from "$lib/database/auth.server";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { SqliteError } from "better-sqlite3";
import { createAndSetSession } from "$lib/database/authUtils";
import { insertNewUser } from "$lib/database/databaseUtils.sever";

// export const load = (async () => {
// 	return {};
// }) satisfies PageServerLoad;

export const actions: Actions = {
	registerUser: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const name = formData.name;
		const email = formData.email;
		const password = formData.password;
		// if (
		// 	typeof name !== "string" ||
		// 	name.length < 3 ||
		// 	name.length > 31 ||
		// 	!/^[a-z0-9_-]+$/.test(name)
		// ) {
		// 	return fail(400, {
		// 		message: "Invalid username"
		// 	});
		// }
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
		}

		const hashedPassword = await new Argon2id().hash(password);
		const userId = generateId(15);

		try {
			await insertNewUser({
				id: userId,
				name: name,
				email: email,
				password: hashedPassword
			});

			await createAndSetSession(lucia, userId, cookies);
		} catch (e) {
			if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
				return fail(400, {
					message: "Username already used"
				});
			}
			return fail(500, {
				message: "An unknown error occurred"
			});
		}
		return redirect(302, "/");
	}
};
