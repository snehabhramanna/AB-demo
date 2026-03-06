
const { jsPDF } = window.jspdf;
let uploadedImage=null;

function showTab(tab,btn){
document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
document.getElementById(tab).classList.add('active');
}

function toggleTheme(){
document.body.classList.toggle('dark');
}

const dropzone=document.getElementById("dropzone");
dropzone.onclick=()=>document.getElementById("imageInput").click();
dropzone.ondragover=e=>{e.preventDefault();dropzone.classList.add("dragover");};
dropzone.ondragleave=()=>dropzone.classList.remove("dragover");
dropzone.ondrop=e=>{
e.preventDefault();
dropzone.classList.remove("dragover");
handleImage(e.dataTransfer.files[0]);
};

document.getElementById("imageInput").onchange=e=>handleImage(e.target.files[0]);

function handleImage(file){
uploadedImage=file;
const reader=new FileReader();
reader.onload=e=>{
const img=new Image();
img.onload=()=>{
document.getElementById("imageInfo").innerText=
`Name: ${file.name} | Size: ${(file.size/1024).toFixed(1)} KB | Resolution: ${img.width}x${img.height}`;
document.getElementById("imagePreview").innerHTML=`<img src="${e.target.result}">`;
}
img.src=e.target.result;
}
reader.readAsDataURL(file);
}

function convertImage(){
if(!uploadedImage) return alert("Upload image first");
document.getElementById("imageLoader").classList.add("active");

const reader=new FileReader();
reader.onload=e=>{
const img=new Image();
img.onload=()=>{
const canvas=document.createElement("canvas");
canvas.width=document.getElementById("width").value||img.width;
canvas.height=document.getElementById("height").value||img.height;
canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);

const format=document.getElementById("format").value;
const quality=document.getElementById("quality").value;
const url=canvas.toDataURL(format,quality);

const link=document.createElement("a");
link.href=url;
link.download=`converted.${format.split("/")[1]}`;
link.click();

document.getElementById("imageLoader").classList.remove("active");
}
img.src=e.target.result;
}
reader.readAsDataURL(uploadedImage);
}

function resetImage(){
document.getElementById("imagePreview").innerHTML="";
document.getElementById("imageInfo").innerText="";
uploadedImage=null;
}

async function pdfToImages(){
const files=document.getElementById("pdfInput").files;
if(!files.length) return alert("Upload PDF first");

document.getElementById("pdfLoader").classList.add("active");
document.getElementById("pdfPreview").innerHTML="";

for(const file of files){
const arrayBuffer=await file.arrayBuffer();
const pdf=await pdfjsLib.getDocument(arrayBuffer).promise;
document.getElementById("pdfInfo").innerText=`Pages: ${pdf.numPages}`;

for(let i=1;i<=pdf.numPages;i++){
const page=await pdf.getPage(i);
const viewport=page.getViewport({scale:1});
const canvas=document.createElement("canvas");
canvas.width=viewport.width;
canvas.height=viewport.height;
await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
document.getElementById("pdfPreview").appendChild(canvas);
}
}

document.getElementById("pdfLoader").classList.remove("active");
}

function mergePDF(){
alert("Merging multiple PDFs requires backend for full reliability.");
}
