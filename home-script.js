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

function loadOpen(){
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res=>res.json())
    .then(data=>{
        const openIssues = data.data.filter(issue => issue.status === 'open');
        currentIssues = openIssues;
        displayAll(openIssues);
        setActiveButton('open-btn');
    })
}

function loadClosed(){
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res=>res.json())
    .then(data=>{
        const closedIssues = data.data.filter(issue => issue.status === 'closed');
        currentIssues = closedIssues;
        displayAll(closedIssues);
        setActiveButton('closed-btn');
    })
}

function loadIssueDetails(id){
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/${id}`)
    .then(res=>res.json())
    .then(issue=>{
        displayIssueDetails(issue.data);
    });
};

function showIssueModal(id) {
    const issue = currentIssues.find(i => i.id == id);
    if (!issue) return;
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
        <div>
            <h1 class="text-2xl font-bold">${issue.title}</h1>
            <div class="flex items-center justify-start gap-4 mt-4">
                <button class="btn ${issue.status === 'open' ? 'btn-success' : 'btn-secondary'} text-[#FFFFFF] rounded-full">${issue.status === 'open' ? 'Opened' : 'Closed'}</button>
                <p class="flex items-center gap-2 text-[#64748B]">. Opened by ${issue.author}</p>
                <p class="flex items-center gap-2 text-[#64748B]">. ${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="mt-4 flex justify-start gap-2">
                ${issue.labels.map((label, index) => {
                    let btnClass = 'btn btn-soft btn-outline rounded-full';
                    if (index === 0) btnClass += ' btn-warning';
                    else if (index === 1) btnClass += ' btn-error';
                    return `<button class="${btnClass}">${label}</button>`;
                }).join('')}
            </div>
            <p class="text-[#64748B] mt-4">${issue.description}</p>
            <div class="grid grid-cols-2 gap-4 items-center justify-between mt-4 p-4 bg-[#64748B30] rounded-md">
                <div>
                    <p class="text-[#64748B]">Assignee:</p>
                    <p>${issue.assignee}</p>
                </div>
                <div>
                    <p class="text-[#64748B]">Priority:</p>
                    <button class="btn ${issue.priority === 'high' ? 'btn-error' : issue.priority === 'medium' ? 'btn-warning' : 'btn-info'} rounded-full px-5">${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</button>
                </div>
            </div>
            <div class="mt-4 text-right">
                <button class="btn" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    document.getElementById('word_modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('word_modal').style.display = 'none';
}

const displayAll=(data)=>{

    console.log(data);
    let count=document.getElementById('issue-count');
    count.innerText=data.length;

    const cardContainer=document.getElementById('card-container');
    cardContainer.innerHTML="";
    data.forEach(issue => {
        const card=document.createElement('div');
        card.innerHTML=`
                  <div class="card shadow-sm rounded-md border-t-4 ${issue.status === 'open' ? 'border-t-[#00A96E]' : 'border-t-[#A855F7]'} bg-[#FFFFFF] p-4 min-h-80">
                <div class=" flex items-center justify-between ">
                    <img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png'}" alt="">
                    <button onclick="showIssueModal(${issue.id})" class="btn btn-soft ${issue.priority === 'high' ? 'btn-error' : issue.priority === 'medium' ? 'btn-warning' : ''} rounded-full px-6">${issue.priority === 'high' ? 'High' : issue.priority === 'medium' ? 'Medium' : 'Low'}</button>
                </div>
                <div>
                    <h2 class="text-lg font-semibold mt-2">${issue.title}</h2>
                    <p class="text-sm text-[#64748B] mt-1">${issue.description}</p>
                    <div class="mt-2 flex justify-start gap-2">
                        ${issue.labels.map((label, index) => {
                            // Default button classes
                            let btnClass = 'btn btn-soft btn-outline rounded-full';
                            // Add color only to first and second buttons
                            if (index === 0) {
                                btnClass += ' btn-warning';
                            } else if (index === 1) {
                                btnClass += ' btn-error';
                            }
                            // Other buttons stay with default outline
                            return `<button class="${btnClass}">${label}</button>`;
                        }).join('')}
                    </div>
                   <hr class="mt-3 border-t border-[#64748B30]">
                    <p class="text-sm text-[#64748B] mt-2">#${issue.id} by ${issue.author}</p>
                    <p class="text-sm text-[#64748B] mt-2">${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `
        cardContainer.appendChild(card);
    });
    manageSpinner(false);
}

document.getElementById('input-search').addEventListener('input', () => {
  
  const input = document.getElementById('input-search');
  const searchValue = input.value.trim().toLowerCase();
  
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
  .then(res => res.json())
  .then(data =>{
    
    displayAll(data.data);

  })
});


loadAll();