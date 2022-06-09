import { useEffect } from "react";
import { useQueryClient } from "react-query";
import useSubmissionsContract, { EventType } from "./useSubmissionsContract";

interface UseEventsQuery {
  game: string;
}

// Listen to events and refresh data
const useEvents = ({ game }: UseEventsQuery) => {
  const queryClient = useQueryClient();
  const submissionsContract = useSubmissionsContract();

  useEffect(() => {
    const handler = (submission) => {
      if (submission.game !== game) {
        return;
      }
      // Invalidates the query whose query key matches the passed array.
      // This will cause the useComments hook to re-render the Comments
      // component with fresh data.
      queryClient.invalidateQueries([
        "submissions",
        { game: submission.game, chainId: submissionsContract.chainId },
      ]);
    };

    submissionsContract.contract.on(EventType.SubmissionAdded, handler);

    return () => {
      submissionsContract.contract.off(EventType.SubmissionAdded, handler);
    };
  }, [queryClient, submissionsContract.chainId, game]);
};

export default useEvents;