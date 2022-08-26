import { ethers } from "ethers";
import { magic } from "../lib/magic";
import useSubmissionsContract from "./useSubmissionsContract";

interface UseAddSubmissionPayload {
  game: string;
  answer: string;
  start: number;
  end: number;
}

const useAddSubmission = (provider) => {
  
  const contract = useSubmissionsContract(provider);

  return (async ({ game, answer, start, end }: UseAddSubmissionPayload) => {
    await contract.addSubmission(game, answer, start, end);
  });
};

export default useAddSubmission;