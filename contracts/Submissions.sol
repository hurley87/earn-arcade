//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Submissions {

    struct Submission {
        uint id;
        string game;
        uint64 start;
        uint64 end;
        address creator_address;
        uint created_at;
    }

    uint32 private idCounter;
    mapping(string => Submission[]) private submissionByDay;

    event SubmissionAdded(Submission submission);

    function getSubmissions(string calldata game) public view returns(Submission[] memory) {
        return submissionByDay[game];
    }

    function addSubmission(string calldata game, uint64 start, uint64 end) public {
        Submission memory submission = Submission({
            id: idCounter,
            game: game,
            start: start,
            end: end,
            creator_address: msg.sender,
            created_at: block.timestamp
        });
        submissionByDay[game].push(submission);
        idCounter++;
        emit SubmissionAdded(submission);
    }
}
