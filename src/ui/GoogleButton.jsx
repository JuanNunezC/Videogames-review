function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.74 1.22 9.26 3.6l6.9-6.9C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8.9 6.9C13.5 13.4 18.3 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8h12.7c-.6 3.2-2.4 5.9-5.1 7.7l7.9 6.1c4.6-4.2 7-10.4 7-17.7z"
      />
      <path
        fill="#FBBC05"
        d="M11.5 28.1c-1-3-1-6.2 0-9.2l-8.9-6.9C-1 17.3-1 30.7 2.6 38.5l8.9-6.9z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6.1c-2.2 1.5-5 2.4-8.1 2.4-6.2 0-11.5-4.2-13.4-9.9l-8.9 6.9C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function GoogleButton({ loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="cursor-pointer w-full p-5 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-3 py-2 rounded-md"
    >
      <GoogleIcon />
      <span>{loading ? "Loading..." : "Continue with Google"}</span>
    </button>
  );
}

export default GoogleButton;
