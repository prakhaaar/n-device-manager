export default function LoggedOutPage() {
  const forced =
    typeof window !== "undefined" &&
    window.location.search.includes("forced=1");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-2">Logged Out</h2>
        {forced ? (
          <p>
            You were force logged out because your device limit was exceeded.
          </p>
        ) : (
          <p>You have been logged out.</p>
        )}

        <a href="/" className="mt-4 inline-block text-indigo-600 underline">
          Go to Home
        </a>
      </div>
    </div>
  );
}
