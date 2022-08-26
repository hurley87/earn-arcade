import { ethers } from "ethers";
import { useEffect } from "react";
import { magic } from "../lib/magic";
import useSubmissionsContract, { EventType } from "./useSubmissionsContract";

interface UseEventsQuery {
  game: string;
}

// Listen to events and refresh data
const useEvents = ({ game }: UseEventsQuery) => {
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
  const submissionsContract = useSubmissionsContract(provider);

  useEffect(() => {
    const handler = (submission) => {
      if (submission.game !== game) {
        return;
      }
      // Invalidates the query whose query key matches the passed array.
      // This will cause the useComments hook to re-render the Comments
      // component with fresh data.
    };

    submissionsContract.contract.on(EventType.SubmissionAdded, handler);

    return () => {
      submissionsContract.contract.off(EventType.SubmissionAdded, handler);
    };
  }, [submissionsContract.chainId, game]);
};

export default useEvents;