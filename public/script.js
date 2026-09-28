function toggleMenu(){
  document.getElementById("navLinks")?.classList.toggle("open");
}
document.querySelectorAll(".nav-links a").forEach(a=>{
  a.addEventListener("click",()=>document.getElementById("navLinks")?.classList.remove("open"));
});

document.querySelectorAll("[data-lightbox]").forEach(img=>{
  img.addEventListener("click",()=>{
    const box=document.querySelector(".lightbox");
    const target=box.querySelector("img");
    target.src=img.src;
    box.classList.add("open");
  });
});
document.querySelector(".close-lightbox")?.addEventListener("click",()=>{
  document.querySelector(".lightbox").classList.remove("open");
});
document.querySelector(".lightbox")?.addEventListener("click",e=>{
  if(e.target.classList.contains("lightbox")) e.currentTarget.classList.remove("open");
});

const quoteForm=document.getElementById("quoteForm");
if(quoteForm){
  quoteForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const button=quoteForm.querySelector("button[type=submit]");
    const notice=document.getElementById("formNotice");
    button.disabled=true;
    button.textContent="Submitting...";
    notice.className="notice";
    try{
      const response=await fetch("/api/quotes",{method:"POST",body:new FormData(quoteForm)});
      const data=await response.json();
      if(!response.ok) throw new Error(data.message||"Unable to submit request.");
      notice.className="notice success";
      notice.textContent=data.message;
      quoteForm.reset();
    }catch(err){
      notice.className="notice error";
      notice.textContent=err.message;
    }finally{
      button.disabled=false;
      button.textContent="Submit Quote Request";
    }
  });
}
