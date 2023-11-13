"use client";
import { useWalletContext } from "@/context/wallet";
import { useCallback, useState } from "react";

export default function Navbar() {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const { isLoggedIn, login, logout, username, scaAddress } =
    useWalletContext();

  const handleLogin = useCallback(async () => {
    setIsLoggingIn(true);
    await login();
    setIsLoggingIn(false);
  }, [login]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  }, [logout]);

  return (
    <div className="flex flex-row justify-between items-center gap-[72px] max-md:flex-col max-md:text-center">
      <div className="text-6xl font-bold">Alchemy Simple AA Dapp</div>
      <div className="flex flex-row items-center gap-[12px] max-md:flex-col max-md:text-center">
        {isLoggedIn ? (
          <a
            href={`https://sepolia.etherscan.io/address/${scaAddress}`}
            target="_blank"
            className="btn text-white bg-gradient-1 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
          >
            {username || "Logged In!"}
          </a>
        ) : (
          <button
            disabled={isLoggingIn}
            onClick={handleLogin}
            className="btn text-white bg-gradient-1 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
          >
            {isLoggingIn ? "Logging In" : "Log In"}
            {isLoggingIn && (
              <span className="loading loading-spinner loading-md"></span>
            )}
          </button>
        )}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="btn text-white bg-gradient-2 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
          >
            {isLoggingOut ? "Logging Out" : "Log Out"}
            {isLoggingOut && (
              <span className="loading loading-spinner loading-md"></span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
