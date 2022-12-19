App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTasks();
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },
  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },
  loadContract: async () => {
    try {
      const res = await fetch("TasksContract.json");
      const tasksContractJSON = await res.json();
      App.contracts.TasksContract = TruffleContract(tasksContractJSON);
      App.contracts.TasksContract.setProvider(App.web3Provider);

      App.tasksContract = await App.contracts.TasksContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },
  render: async () => {
    document.getElementById("account").innerText = App.account;
  },
  renderTasks: async () => {
    const tasksCounter = await App.tasksContract.tasksCounter();
    const taskCounterNumber = tasksCounter.toNumber();

    let html = "";

    for (let i = 1; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0].toNumber();
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreatedAt = task[4];
      const taskPrice = task[5];

      // Creating a task Card
      let taskElement = `<div class="wrapper">
      <svg class="header" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon fill="white" points="0,0 100,100 0,100"/>
      </svg>
      <div class="card-container">
        <div class="card-body">
          <div class="side side-back">
            <div class="container-fluid">
              <div class="row">
                <div class="product-image col-5">
                  <img src="panda.png" alt="Car" />
                </div>
              </div>
            </div>
          </div>
          <div class="side side-front">
            <div class="container-fluid">
              <div class="row">
                <div class="product-image col-12 col-lg-5">
                  <img src="./images/panda.png" alt="Car" />
                </div>
                <div class="content col-12 col-lg-7">
                  <h2>Rent ${taskTitle}</h2>
                  <div class="price-rating">
                    <div class="price">
                      <h3>Price/day:</h3>
                      <p>${taskPrice} ETH</p>
                    </div>
                    <div class="rating">
                      <h3>Id: <span class="rating-text">${taskId}</span></h3>
                      <div id="rateYo"></div>
                    </div>
                  </div>
                  <div class="details">
                    <p>
                    ${taskDescription}
                    </p><br>
                    <p class="text-muted">
                      Car was created ${new Date(taskCreatedAt * 1000).toLocaleString()}
                    </p>
                    <span class="text-muted">Rented ${taskDone}</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input"
                           data-id="${taskId}"
                           type="checkbox" 
                           onchange="App.toggleDone(this)" 
                           ${taskDone === true && "checked"}
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
      html += taskElement;
    }

    document.querySelector("#tasksList").innerHTML = html;
  },
  createTask: async (title, description, price) => {
    try {
      const result = await App.tasksContract.createTask(title, description, price, {
        from: App.account,
      });
      console.log(result.logs[0].args);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },
  toggleDone: async (element) => {
    const taskId = element.dataset.id;
    await App.tasksContract.toggleDone(taskId, {
      from: App.account, value: "999999999999999999"
    });
    window.location.reload();
  },
};
