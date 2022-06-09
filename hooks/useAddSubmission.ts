import { useMutation } from "react-query";
import useSubmissionsContract from "./useSubmissionsContract";

interface UseAddSubmissionPayload {
  game: string;
  answer: string;
  start: number;
  end: number;
}

const useAddSubmission = () => {
  const contract = useSubmissionsContract();

  return useMutation(async ({ game, answer, start, end }: UseAddSubmissionPayload) => {
    await contract.addSubmission(game, answer, start, end);
  });
};

export default useAddSubmission;