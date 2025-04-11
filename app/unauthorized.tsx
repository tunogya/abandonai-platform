export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <p>
        <a href="/auth/login?audience=https://abandon.ai/api">Log in</a>
      </p>
    </main>
  )
}