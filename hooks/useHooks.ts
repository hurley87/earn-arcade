import { useQuery } from "react-query";
import useSubmissionsContract from "./useSubmissionsContract";

interface UseSubmissionsQuery {
  game: string;
}

const useSubmissions = ({ game }: UseSubmissionsQuery) => {
  const contract = useSubmissionsContract();
  return useQuery(["submissions", { game, chainId: contract.chainId }], () =>
    contract.getSubmissions(game)
  );
};

export default useSubmissions;