import { ethers } from "ethers";
import { useMutation } from "react-query";
import useSubmissionsContract from "./useSubmissionsContract";

const useAdmission = () => {
  const contract = useSubmissionsContract();

  return useMutation(async () => {
    await contract.payAdmission({ value: ethers.utils.parseEther("1") });
  });
};

export default useAdmission;