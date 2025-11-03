import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const ARCHIVO_CURRICULUM =path.join(__dirname, "curriculum.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join (__dirname, "../frontend")));

function leerCurriculum (){
    try{
        const contenido = fs.readFileSync (ARCHIVO_CURRICULUM, "utf-8");
        const formaciones = JSON.parse(contenido);

        console.log(`Se leyeron ${formaciones.length} formaciones del archivo`);
        return formaciones;
    } catch{
        console.error("Error al leer formaciones:", error.message);
        return[];
    }
}


app.get("/", (req,res)=>{
    console.log("Alguien visitó la página principal");
    res.sendFile(path.join(__dirname,"../frontend/index.html"));

});

app.get("/curriculum",(req,res)=>{
    const formaciones = leerCurriculum();

    res.json({datos : formaciones});
});

app.post("/curriculum", (req,res)=>{
    const {formacion, duracion, fecha} =req.body;

    if(!formacion || !duracion || !fecha){
        return res.status(400).json({
            exito:false,
            mensaje: "Faltan datos.Se necesita: formacion, duracion y fecha"
        });
    }

     let formaciones = leerCurriculum();

    const nuevaFormacion = {
        id: obtenerSiguienteId(formaciones),
        formacion: formacion.trim(), //trim() quita los espacions al inicio y al final
        duracion: duracion.trim(),
        fecha: fecha.trim()
    };

    formaciones.push(nuevaFormacion);

    if(guardarFormacion(formaciones)){
        res.status(201).json({
            exito:true,
            datos: nuevaFormacion,
            mensaje:`Formacion ${nuevaFormacion.formacion} creada exitosamente`
        });
    }
    else{
        res.status(500).json({
            exito
        });
    }


});

function obtenerSiguienteId(formaciones){
    if(formaciones.length ===0){
        return 1;
    }

    const ids = formaciones.map(formaciones => formaciones.id);
    const idMasAlto =Math.max(...ids);
    return idMasAlto +1 ;
}


function guardarFormacion(formaciones) {
    try {
        // Convertir el array de JavaScript a texto JSON (bonito y formateado)
        const contenidoJSON = JSON.stringify(formaciones, null, 2);
        
        // Escribir el contenido al archivo
        fs.writeFileSync(ARCHIVO_CURRICULUM, contenidoJSON);
        
        console.log(`💾 Se guardaron ${formaciones.length} formaciones en el archivo`);
        return true;
    } catch (error) {
        console.error('❌ Error al guardar formaciones:', error.message);
        return false;
    }
}


app.listen (PORT,()=>{
    console.log("http://localhost:3000");
});