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

function loadAll() {
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res => res.json())
    .then(data => {
        const issues = data.data || data; 
        currentIssues = issues;
        displayAll(issues);
        setActiveButton('all-btn');
    })
    .catch(err => manageSpinner(false));
}

function loadOpen(){
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res=>res.json())
    .then(data=>{
        const issues = data.data || data; 
        const openIssues = issues.filter(issue => issue.status === 'open');
        currentIssues = openIssues;
        displayAll(openIssues);
        setActiveButton('open-btn');
    })
    .catch(err => manageSpinner(false));
}

function loadClosed(){
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res=>res.json())
    .then(data=>{
        const issues = data.data || data; 
        const closedIssues = issues.filter(issue => issue.status === 'closed');
        currentIssues = closedIssues;
        displayAll(closedIssues);
        setActiveButton('closed-btn');
    })
    .catch(err => manageSpinner(false));
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
        card.innerHTML = `
            <div class="card shadow-sm rounded-md border-t-4 ${issue.status === 'open' ? 'border-t-[#00A96E]' : 'border-t-[#A855F7]'} bg-[#FFFFFF] p-4 flex flex-col h-full">
                
                <div class="flex items-center justify-between mb-4">
                    <img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png'}" class="w-6 h-6" alt="status">
                    
                    <button onclick="showIssueModal('${issue.id}')" class="btn btn-xs btn-soft ${issue.priority === 'high' ? 'btn-error' : issue.priority === 'medium' ? 'btn-warning' : 'btn-info'} rounded-full px-4 font-bold">
                        ${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                    </button>
                </div>

                <div class="flex-grow">
                    <h2 class="text-lg font-bold text-[#1E293B] line-clamp-1">${issue.title}</h2>
                    <p class="text-sm text-[#64748B] mt-2 line-clamp-3 leading-relaxed">
                        ${issue.description || 'No description available.'}
                    </p>

                    <div class="mt-4 flex flex-wrap gap-2">
                        ${issue.labels.map((label, index) => {
                            let styleClass = index === 0 ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#FEE2E2] text-[#DC2626]';
                            return `<span class="px-3 py-1 text-[11px] font-semibold rounded-full ${styleClass}">${label}</span>`;
                        }).join('')}
                    </div>
                </div>

                <div class="mt-5 pt-3 border-t border-[#64748B15]">
                    <p class="text-xs font-semibold text-[#64748B]">#${issue.id} by ${issue.author}</p>
                    <p class="text-[11px] text-[#94A3B8] mt-1">
                        <i class="fa-regular fa-calendar-days mr-1"></i> 
                        ${new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
    manageSpinner(false);
}

document.getElementById('input-search').addEventListener('input', () => {
    const searchValue = document.getElementById('input-search').value.trim().toLowerCase();
    
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
    .then(res => res.json())
    .then(data => {
        const searchResults = data.data || data;
        displayAll(searchResults);
    });
});


loadAll();