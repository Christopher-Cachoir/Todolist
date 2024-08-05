let monPrenom = document.getElementById("prenom");

let form = document.getElementById("form");

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(monPrenom.value == ''){  
        alert('Vous devez saisir votre prenom');
    }else{
        localStorage.setItem("prenom", monPrenom.value);
        window.location.href ="tasks.html";
    }
} )

