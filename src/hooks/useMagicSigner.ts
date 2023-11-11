import { useEffect, useMemo, useState } from "react";
import { magicApiKey, alchemyRpcUrl } from "@/config/client";
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { Magic } from "magic-sdk";

import type { EthNetworkConfiguration } from "magic-sdk";
import { WalletClient, createWalletClient, custom } from "viem";

export const useMagicSigner = () => {
  const [magicClient, setMagicClient] = useState<WalletClient | null>(null);

  const magic = useMemo(() => {
    if (typeof window !== "undefined") {
      const formattedNetwork = (): EthNetworkConfiguration => {
        return {
          rpcUrl: alchemyRpcUrl as string,
          chainId: 80001,
        };
      };
      return new Magic(magicApiKey, {
        network: formattedNetwork(),
      });
    }
  }, []);

  useEffect(() => {
    if (!magic) return;
    const handler = async () => {
      const provider = await magic.wallet.getProvider();
      const client: WalletClient = createWalletClient({
        transport: custom(provider),
      });
      setMagicClient(client);
    };
    handler();
  }, [magic]);

  const magicSigner: SmartAccountSigner = new WalletClientSigner(
    magicClient as any,
    "magic"
  );

  return { magic, signer: magicSigner };
};
