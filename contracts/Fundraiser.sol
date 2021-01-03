// SPDX-License-Identifier: MIT

pragma solidity >=0.7.3;

import "hardhat/console.sol";

contract FundraiserFactory {
    Fundraiser[] public fundraisers;

    function createFundraiser(
        address payable recipient,
        uint256 fundingGoal,
        uint256 minimumDonation
    ) public {
        Fundraiser f =
            new Fundraiser(recipient, fundingGoal, minimumDonation, msg.sender);
        fundraisers.push(f);
    }

    function getFundraisers() public view returns (Fundraiser[] memory) {
        return fundraisers;
    }
}

contract Fundraiser {
    struct Donator {
        address donator;
        uint256 amount;
    }

    struct Request {
        string title;
        uint256 amount;
        uint256 approvalCount;
        mapping(address => bool) approvals;
        bool complete;
    }

    address public owner;
    address payable public recipient;

    uint256 public fundingGoal;
    uint256 public fundings;
    uint256 public minimumDonation;

    mapping(address => Donator) public donators;
    uint256 public donatorCount;

    mapping(uint256 => Request) public requests;
    uint256 public requestCount;
    uint256 public pendingRequests;

    bool public fundingGoalReached;
    bool public fundraiserIsActive;
    uint256 public threshold;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onlyDonator() {
        require(
            msg.sender == donators[msg.sender].donator,
            "Only donators can call this function."
        );
        _;
    }

    modifier refundEligibility() {
        require(
            fundings < threshold,
            "You are no longer legible to request a refund."
        );
        _;
    }

    modifier requestPermitGranted() {
        require(
            fundings >= threshold,
            "You don't have permission to create a request yet."
        );
        _;
    }

    modifier fundraiserActive() {
        require(fundraiserIsActive, "Fundraiser is no longer active.");
        _;
    }

    constructor(
        address payable _recipient,
        uint256 _fundingGoal,
        uint256 _minimumDonation,
        address _owner
    ) {
        owner = _owner;
        recipient = _recipient;
        fundingGoal = _fundingGoal;
        minimumDonation = _minimumDonation;
        fundingGoalReached = false;
        requestCount = 0;
        pendingRequests = 0;
        threshold = calculateThreshold(_fundingGoal);
        fundraiserIsActive = true;
    }

    function calculateThreshold(uint256 x) private pure returns (uint256) {
        return (x * 2500) / 10000;
    }

    function donate() public payable fundraiserActive {
        require(msg.value >= minimumDonation, "Minimum donation required.");
        fundings += msg.value;
        if (donators[msg.sender].donator == msg.sender) {
            donators[msg.sender].amount += msg.value;
        } else {
            donators[msg.sender] = Donator({
                donator: msg.sender,
                amount: msg.value
            });
            donatorCount++;
        }
    }

    function createWithdrawRequest(string memory title, uint256 amount)
        public
        onlyOwner
        requestPermitGranted
        fundraiserActive
    {
        Request storage r = requests[requestCount];
        r.title = title;
        r.amount = amount;
        r.approvalCount = 0;
        r.complete = false;
        requestCount++;
        pendingRequests++;
    }

    function approveWithdrawRequest(uint256 key)
        public
        onlyDonator
        fundraiserActive
    {
        Request storage r = requests[key];

        require(!r.complete, "Request has already been processed.");
        require(
            !r.approvals[msg.sender],
            "You have already voted on this request."
        );

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function completeWithdrawRequest(uint256 key)
        public
        onlyOwner
        requestPermitGranted
        fundraiserActive
    {
        Request storage r = requests[key];

        require(
            r.approvalCount > (donatorCount / 2),
            "Not enough votes. Please try again later."
        );
        require(!r.complete, "Request has already been processed.");

        if (fundingGoalReached && r.amount == address(this).balance) {
            fundraiserIsActive = false;
        }

        recipient.transfer(r.amount);
        r.complete = true;
        pendingRequests--;
    }

    function createWithdrawAllRequest(string memory title)
        public
        onlyOwner
        requestPermitGranted
        fundraiserActive
    {
        require(
            pendingRequests == 0,
            "Can't issue a full withdrawal while pending requests."
        );
        fundingGoalReached = checkFundingGoalReached();
        require(fundingGoalReached, "Funding goal not reached yet.");
        createWithdrawRequest(title, address(this).balance);
    }

    function refund(address payable rec)
        public
        onlyDonator
        refundEligibility
        fundraiserActive
    {
        require(
            address(this).balance >= donators[msg.sender].amount,
            "We are unable to issue refunds at the moment. Please try again later."
        );

        fundings -= donators[msg.sender].amount;
        rec.transfer(donators[msg.sender].amount);
        delete donators[msg.sender];
        donatorCount--;
    }

    function checkFundingGoalReached() private view returns (bool) {
        if (fundings >= fundingGoal) {
            return true;
        }

        return false;
    }

    function statistics()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            address
        )
    {
        return (
            minimumDonation,
            fundingGoal,
            fundings,
            donatorCount,
            requestCount,
            threshold,
            owner,
            recipient
        );
    }

    function kill() private onlyOwner {
        selfdestruct(recipient);
    }
}
