const btnVerficar = document.getElementById("button-verficacion");
var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];

btnVerficar.addEventListener("click", ()=>{
  alert(validacionDNI())
});

function validacionDNI(){
  const numDNI = document.getElementById("text-numeroDNI").value;
  const letraDNI = document.getElementById("text-letraDNI").value;
  if(numDNI.trim() === "" || letraDNI.trim()==="" || !Number.isInteger(Number(numDNI))){
    return "Verifique la entrada"
  }
  if(Number(numDNI)<0 || Number(numDNI) > 99999999){
    return "Formato de numero fuera de rango"
  }
  if(letraDNI.trim().toUpperCase() === letras[Number(numDNI)%23]){
    return "El DNI y la letra es correcta"
  }else{
    return "El DNI y la letra no es correcta"
  }
}