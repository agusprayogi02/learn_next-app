import {getProviders, signIn} from 'next-auth/react';

function Login({providers}) {
  return (
    <div className="flex flex-col items-center min-h-screen w-screen justify-center bg-black">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-green-500 p-5 rounded-lg text-white hover:text-gray-500 hover:bg-green-200 font-semibold"
            onClick={() => signIn(provider.id, {callbackUrl: '/'})}>
            Sign In with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
