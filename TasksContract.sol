// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    address payable addressContract;
    uint256 public tasksCounter = 0;

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
        string price;
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt,
        string price
    );
    event TaskToggledDone(uint256 id, bool done);

    mapping(uint256 => Task) public tasks;

    constructor() {
        createTask("Fiat", "White color, high power, safety at all times", "1");
    }

    receive() external payable {}

    function createTask(string memory _title, string memory _description, string memory _price)
        public
    {
        tasksCounter++;
        tasks[tasksCounter] = Task(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp,
            _price
        );
        emit TaskCreated(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp,
            _price
        );
    }

    function toggleDone(uint256 _id) external payable {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggledDone(_id, _task.done);
    }
} 
