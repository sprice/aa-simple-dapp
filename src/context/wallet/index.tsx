"use client";
import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { useMagicSigner } from "@/hooks/useMagicSigner";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Address } from "@alchemy/aa-core";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { shortAddress } from "@/utils";

type WalletContextProps = {
  // Functions
  login: () => Promise<void>;
  logout: () => Promise<void>;

  // Properties
  provider: AlchemyProvider;
  ownerAddress?: Address;
  scaAddress?: Address;
  username?: string;
  isLoggedIn: boolean;
};

const defaultUnset: any = null;
const WalletContext = createContext<WalletContextProps>({
  // Default Values
  provider: defaultUnset,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  isLoggedIn: defaultUnset,
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ownerAddress, setOwnerAddress] = useState<Address>();
  const [scaAddress, setScaAddress] = useState<Address>();
  const [username, setUsername] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { magic, signer, isLoading: isSignerLoading } = useMagicSigner();

  const {
    provider,
    connectProviderToAccount,
    disconnectProviderFromAccount,
    isLoading: isProviderLoading,
  } = useAlchemyProvider();

  const login = useCallback(async () => {
    if (isSignerLoading) return;
    if (!magic || !magic.user || !signer) {
      console.error("Magic not initialized");
      return;
    }
    const accounts = await magic.wallet.connectWithUI();
    const info = await magic.user.getInfo();
    if (!accounts.length || !info.publicAddress) {
      console.error("Magic login failed");
      return;
    }

    setIsLoggedIn(true);
    connectProviderToAccount(signer);
    const sca = await provider.getAddress();
    setUsername(shortAddress(sca));
    setOwnerAddress(info.publicAddress as Address);
    setScaAddress(sca);
  }, [magic, connectProviderToAccount, signer, isSignerLoading, provider]);

  const logout = useCallback(async () => {
    if (!magic || !magic.user) {
      console.error("Magic not initialized");
      return;
    }

    if (!(await magic.user.logout())) {
      console.error("Magic logout failed");
      return;
    }

    setIsLoggedIn(false);
    disconnectProviderFromAccount();
    setUsername(undefined);
    setOwnerAddress(undefined);
    setScaAddress(undefined);
  }, [magic, disconnectProviderFromAccount]);

  useEffect(() => {
    async function fetchData() {
      if (isSignerLoading) return;
      if (!magic || !magic.user || !signer) {
        console.error("Magic not initialized");
        return;
      }

      const isLoggedIn = await magic.user.isLoggedIn();

      if (!isLoggedIn) {
        return;
      }

      const info = await magic.user.getInfo();
      if (!info.publicAddress) {
        throw new Error("Magic login failed");
      }

      setIsLoggedIn(isLoggedIn);
      connectProviderToAccount(signer);
      const sca = await provider.getAddress();
      setUsername(shortAddress(sca));
      setOwnerAddress(info.publicAddress as Address);
      setScaAddress(sca);
    }
    fetchData();
  }, [magic, connectProviderToAccount, signer, provider, isSignerLoading]);

  return (
    <WalletContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        provider,
        ownerAddress,
        scaAddress,
        username,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
