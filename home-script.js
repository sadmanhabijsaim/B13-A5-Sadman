console.log("Home page initialized.");

const manageSpinner = (status) => {
  if (status==true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("card-container").classList.add("hidden");
  } else {
    document.getElementById("card-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
}
};

function setActiveButton(activeId) {
    document.getElementById('all-btn').className = 'btn btn-outline btn-ghost btn-primary';
    document.getElementById('open-btn').className = 'btn btn-outline btn-ghost btn-primary';
    document.getElementById('closed-btn').className = 'btn btn-outline btn-ghost btn-primary';
    document.getElementById(activeId).className = 'btn btn-primary';
}

let currentIssues = [];

function loadAll(){
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res=>res.json())
    .then(data=>{
        currentIssues = data.data;
        displayAll(data.data);
        setActiveButton('all-btn');
    })
}