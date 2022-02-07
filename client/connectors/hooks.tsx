import { useEffect } from "react";
import { hooks } from "./metamask";

const {
  useAccounts,
  useError,
  useProvider,
  useIsActive,
  useIsActivating,
  useChainId,
  useWeb3React,
  useENSNames,
} = hooks;

export function useConnection() {
  const chainId = useChainId();
  const isActivating = useIsActivating();
  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const accounts = useAccounts();
  const error = useError();
  const isActive = useIsActive();
  const { account, active } = useWeb3React(provider);

  useEffect(() => {}, []);

  return { account, active };
}
