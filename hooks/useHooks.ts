import { ethers } from "ethers";
import { useQuery } from "react-query";
import { magic } from "../lib/magic";
import useSubmissionsContract from "./useSubmissionsContract";

interface UseSubmissionsQuery {
  game: string;
}

const useSubmissions = ({ game }: UseSubmissionsQuery) => {
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
  const contract = useSubmissionsContract(provider);
  return useQuery(["submissions", { game, chainId: contract.chainId }], () =>
    contract.getSubmissions(game)
  );
};

export default useSubmissions;