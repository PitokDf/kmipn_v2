import Link from 'next/link';

const LoginButton = () => {
  return (
    <a
      href="/auth/login"
      className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md 
        hover:bg-orange-700 transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      <span>Login</span>
    </a>
  );
};

export default LoginButton;