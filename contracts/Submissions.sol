//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Submissions {

    struct Submission {
        uint id;
        string game;
        string answer;
        uint64 start;
        uint64 end;
        address creator_address;
        uint created_at;
    }

    uint32 private idCounter;
    mapping(string => Submission[]) private submissionByDay;

    event SubmissionAdded(Submission submission);
    event StartGame(
        address recipient,
        uint256 amount
    );

    function getSubmissions(string calldata game) public view returns(Submission[] memory) {
        return submissionByDay[game];
    }

    function addSubmission(string calldata game, string calldata answer, uint64 start, uint64 end) public {
        Submission memory submission = Submission({
            id: idCounter,
            game: game,
            answer: answer,
            start: start,
            end: end,
            creator_address: msg.sender,
            created_at: block.timestamp
        });
        submissionByDay[game].push(submission);
        idCounter++;
        emit SubmissionAdded(submission);
    }

    function admission() external payable  {
        address payable bank = payable(0x413f94C1698b7D731213b4469f50Fcbcd2D33789);
        bank.transfer(msg.value);
        emit StartGame(bank, msg.value);
    }

}
