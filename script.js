const students=[
{id:"STU001",name:"Arun Kumar",room:"204",course:"B.Sc Computer Science",status:"Active"},
{id:"STU002",name:"Priya S",room:"205",course:"BCA",status:"Active"},
{id:"STU003",name:"Rahul Raj",room:"101",course:"B.Tech IT",status:"Active"},
{id:"STU004",name:"Divya M",room:"102",course:"B.Com",status:"Active"},
{id:"STU005",name:"Karthik V",room:"103",course:"B.Sc Computer Science",status:"Active"},
{id:"STU006",name:"Meena R",room:"204",course:"BCA",status:"Active"}];

const rooms=[
{n:"101",b:"A",o:3,c:4},{n:"102",b:"A",o:4,c:4},{n:"103",b:"A",o:2,c:4},{n:"104",b:"A",o:1,c:4},
{n:"201",b:"B",o:4,c:4},{n:"202",b:"B",o:3,c:4},{n:"203",b:"B",o:2,c:4},{n:"204",b:"A",o:3,c:4,mine:true},
{n:"205",b:"A",o:2,c:4},{n:"206",b:"A",o:1,c:4},{n:"207",b:"B",o:4,c:4},{n:"208",b:"B",o:0,c:4}
];

let complaints=[
{title:"Room Fan Not Working",desc:"Ceiling fan making noise and stops occasionally.",status:"In Progress",date:"Oct 07, 2026",icon:"🛠️"},
{title:"Water Dispenser Issue",desc:"Water dispenser near Block A needs maintenance.",status:"Resolved",date:"Sep 29, 2026",icon:"💧"},
{title:"Bathroom Light",desc:"Light near Room 204 is not working.",status:"Pending",date:"Sep 26, 2026",icon:"💡"}
];

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function showPage(page){
  $$(".page").forEach(x=>x.classList.remove("active"));
  $(`#page-${page}`).classList.add("active");
  $$(".nav-item[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  $("#sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-page]").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.page)));

$("#today").textContent=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

function renderStudents(){
 const q=$("#studentSearch").value.toLowerCase(), room=$("#roomFilter").value;
 const list=students.filter(s=>(s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)||s.course.toLowerCase().includes(q))&&(room==="all"||s.room===room));
 $("#studentTable").innerHTML=list.map(s=>`<tr><td><div class="student-cell"><span class="mini-avatar">${s.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><b>${s.name}</b></div></td><td>${s.id}</td><td>Room ${s.room}</td><td>${s.course}</td><td><span class="status success">${s.status}</span></td><td><button class="action-btn" onclick="editStudent('${s.id}')">View</button></td></tr>`).join("");
}
$("#studentSearch").addEventListener("input",renderStudents);
$("#roomFilter").addEventListener("change",renderStudents);

function renderRooms(){
 $("#roomGrid").innerHTML=rooms.map(r=>{let pct=r.o/r.c*100;return `<div class="room-card ${r.mine?"mine":""}"><div class="room-top"><div><div class="room-number">${r.n}</div><div class="room-block">Block ${r.b}${r.mine?" · YOUR ROOM":""}</div></div><span class="status ${r.o===r.c?"warning":"success"}">${r.o===r.c?"Full":"Available"}</span></div><div class="occupancy"><div style="width:${pct}%"></div></div><p>${r.o} of ${r.c} beds occupied</p><div class="bed-row">${Array.from({length:r.c},(_,i)=>`<span class="bed ${i>=r.o?"empty":""}">🛏</span>`).join("")}</div></div>`}).join("");
}

function renderComplaints(){
 $("#complaintList").innerHTML=complaints.map(c=>`<div class="complaint-card"><div class="complaint-icon">${c.icon}</div><div class="complaint-body"><h3>${c.title}</h3><p>${c.desc}</p></div><div class="complaint-meta"><span class="status ${c.status==="Resolved"?"success":"warning"}">${c.status}</span><br><br>${c.date}</div></div>`).join("");
}

function openModal(title,fields,onSubmit){
 $("#modalTitle").textContent=title;
 $("#modalForm").innerHTML=`<div class="modal-form-grid">${fields.map(f=>`<label>${f.label}<input id="mf-${f.key}" ${f.value?`value="${f.value}"`:""} placeholder="${f.placeholder||""}" ${f.required===false?"":"required"}></label>`).join("")}<button class="primary-btn" type="submit">Save Details</button></div>`;
 $("#modalBackdrop").classList.add("show");
 $("#modalForm").onsubmit=e=>{e.preventDefault();const data={};fields.forEach(f=>data[f.key]=$(`#mf-${f.key}`).value);onSubmit(data);closeModal()};
}
function closeModal(){$("#modalBackdrop").classList.remove("show")}
$("#closeModal").onclick=closeModal;
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});

$("#addStudentBtn").onclick=()=>openModal("Add New Student",[
{label:"Student Name",key:"name",placeholder:"Enter full name"},
{label:"Student ID",key:"id",placeholder:"Example: STU007"},
{label:"Room Number",key:"room",placeholder:"Example: 206"},
{label:"Course",key:"course",placeholder:"Example: BCA"}
],d=>{students.push({...d,status:"Active"});renderStudents();toast("Student added successfully ✓")});

window.editStudent=id=>{const s=students.find(x=>x.id===id);openModal("Student Details",[
{label:"Student Name",key:"name",value:s.name},{label:"Student ID",key:"id",value:s.id},{label:"Room Number",key:"room",value:s.room},{label:"Course",key:"course",value:s.course}
],d=>{Object.assign(s,d);renderStudents();toast("Student details updated ✓")})};

$("#allocateBtn").onclick=()=>openModal("Allocate Room",[
{label:"Student ID",key:"id",placeholder:"Example: STU007"},
{label:"Room Number",key:"room",placeholder:"Example: 208"}
],d=>{toast(`Room ${d.room} allocated to ${d.id} ✓`);});

$("#payBtn").onclick=()=>openModal("Make Fee Payment",[
{label:"Amount",key:"amount",placeholder:"₹ 12,500"},
{label:"Payment Method",key:"method",placeholder:"UPI / Card / Net Banking"}
],d=>toast(`Payment of ${d.amount} successful ✓`));

$("#complaintBtn").onclick=()=>openModal("New Complaint",[
{label:"Issue Title",key:"title",placeholder:"Example: Fan not working"},
{label:"Description",key:"desc",placeholder:"Describe the problem"}
],d=>{complaints.unshift({...d,status:"Pending",date:"Today",icon:"🛠️"});renderComplaints();toast("Complaint submitted ✓")});

$("#editProfile").onclick=()=>toast("Profile editing enabled ✎");
$("#saveProfile").onclick=()=>toast("Profile saved successfully ✓");
$("#notificationBtn").onclick=()=>toast("You have 2 new notifications 🔔");
$("#logoutBtn").onclick=()=>toast("Demo logout — connect authentication for production");

$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");$("#themeBtn").innerHTML=document.body.classList.contains("dark")?"<span>☀</span> Light Mode":"<span>☾</span> Dark Mode";localStorage.setItem("dark",document.body.classList.contains("dark"))};
if(localStorage.getItem("dark")==="true"){document.body.classList.add("dark");$("#themeBtn").innerHTML="<span>☀</span> Light Mode"}

$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");

function toast(msg){$("#toast").textContent=msg;$("#toast").classList.add("show");clearTimeout(window.t);window.t=setTimeout(()=>$("#toast").classList.remove("show"),2200)}

renderStudents();renderRooms();renderComplaints();