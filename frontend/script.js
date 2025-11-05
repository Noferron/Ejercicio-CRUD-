const URL_API = "http://localhost:3000/curriculum";

const listaFormaciones = document.getElementById("listaFormaciones");
const formaciones=document.getElementById("formaciones");




/*listaFormaciones.addEventListener ("click",()=>{
    fetch(URL_API)
        .then ((res)=> res.json())
            .then((data)=>{
                formaciones.innerHTML = data.datos
                    .map(item => `<li>🐱‍💻${item.formacion}-${item.duracion}</li>`)
                    .join("");
            });
});*/


/*Con este script adaptado a mi código
 puedo generar de forma automática nuevas tarjetas sin actualizar la página y sin modificar el index*/

async function cargarFormaciones() {
  try {
    const res = await fetch(URL_API);
    const datos = await res.json(); // ← aquí recibes el objeto con la propiedad 'datos'

    const contenedor = document.getElementById('listado');
    contenedor.innerHTML = '';

    datos.datos.forEach(forma => {
      const card = document.createElement('div');
      card.className = 'formacion-card';
      card.innerHTML = `
        <h3>${forma.formacion}</h3>
        <p><strong>Formación:</strong> ${forma.formacion}</p>
        <p><strong>Duración:</strong> ${forma.duracion}</p>
        <p><strong>Fecha:</strong> ${forma.fecha}</p>
        <button onclick="editarFormacion(${forma.id}, '${forma.formacion}', '${forma.duracion}', '${forma.fecha}')">Editar</button>
        <button onclick="eliminarFormacion(${forma.id})">Eliminar</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando formaciones:', error);
    document.getElementById('Curriculum').innerHTML ='<p>Error al cargar los datos 😢</p>';
  }
}

cargarFormaciones();

//----------Guardar Formaciones-----------------------------

const formulario =document.getElementById("formulario");
const campoFormacion =document.getElementById("campoFormacion");
const campoDuracion =document.getElementById("campoDuracion");
const campoFecha= document.getElementById("campoFecha");

formulario.addEventListener("submit", async(evento)=>{
    evento.preventDefault(); //Evita la recarga de la página por el envío del formulario

    const formacion= campoFormacion.value.trim();
    const duracion = campoDuracion.value.trim();
    const fecha = campoFecha.value;
 
   /*if(!formacion || !duracion || !fecha){
    mostrarMensaje("Por favor, completa todos los campos", "error");
    return;
   }*/

   const datosFormacion = {
    formacion: formacion,
    duracion: duracion,
    fecha: fecha
   };

   if(idFormacionEditando){
    await actualizarFormacion(idFormacionEditando, datosFormacion);
    idFormacionEditando=null;
   }
   else{
    await guardarFormaciones(datosFormacion);
   }

   formulario.reset();
   cargarFormaciones();
});



async function guardarFormaciones(datosFormacion) {
    try{
        const res = await fetch(URL_API,{
            method: "POST", //POST significa "Crea algo nuevo"
            headers: {
                "Content-Type": "application/json" //Decimos que enviamos JSON
            },
            body: JSON.stringify(datosFormacion) //Convertir objeto a texto JSON
        });

        const datos = await res.json();
    }
    catch (error){
        console.error("Error al crear formación", error);
    }
}

//---------------Editar formaciones----------------------------------
let idFormacionEditando = null;

function editarFormacion (id,formacion,duracion,fecha){
  campoFormacion.value = formacion;
  campoDuracion.value = duracion;
  campoFecha.value = fecha;
  idFormacionEditando = id;
}

//-------------Actualizar formación-----------------------------------
async function actualizarFormacion(id,datosFormacion) {
  try{
    const res = await fetch(`${URL_API}/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify(datosFormacion)
    });

    const datos= await res.json();
    console.log("Formación actualizada:", datos);
  }
  catch(error){
    console.error("Error al actualizar formación", error);
  }
}

//---------------Eliminar formación-------------------------------------

async function eliminarFormacion(id) {
  if(!confirm("¿Estás seguro de que quieres eliminar esta formación"))return;

  try{
    const res =await fetch (`${URL_API}/${id}`,{
      method:"DELETE"
    });

    const datos = await res.json();
    console.log("Formación eliminada:", datos);
    cargarFormaciones();
  }
  catch(error){
    console.error("Error al eliminar formación", error);
  }
  
}