<script lang="ts">
	import type { PageData } from "./$types";

	// export let data: PageData;
</script>

<section>
	<h1>Register</h1>

	<form action="?/registerUser" method="post">
		<input type="text" placeholder="name" />
		<input type="email" placeholder="email" />
		<input type="password" placeholder="password" />
		<button type="submit">Register</button>
	</form>
</section>

<style>
	section {
		display: grid;
		place-items: center;
		padding: 8rem 0;
	}

	input {
		display: block;
		padding: 0.5rem 1rem;
		margin-top: 0.5rem;
	}

	button {
		margin-top: 1rem;
	}
</style>
