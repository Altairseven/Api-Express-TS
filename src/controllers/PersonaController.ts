import express, { Request, Response } from "express";
import { Persona } from "../models/Persona";
import { v4 as uuidv4 } from 'uuid';

const PersonaController = express.Router();

let PERSONAS: Array<Persona> = [
    { id: "1", nombre: "Franco", apellido: "Pioletti", cuit: "20354472709", fechaNac: new Date(1990, 8, 6), email: "elpiole@gmail.com", nroDocumento: "35447270" },
    { id: "2", nombre: "Franco", apellido: "Pioletti", cuit: "20354472709", fechaNac: new Date(1990, 8, 6), email: "elpiole@gmail.com", nroDocumento: "35447270" }
];



PersonaController.get("/", async (req: Request, res: Response): Promise<Response<Array<Persona>>> => {
    return res.status(200).send(PERSONAS);
});


PersonaController.get("/:id", async (req: Request, res: Response): Promise<Response<Persona>> => {
    const persona = PERSONAS.find(x=> x.id == req.params.id);
    if(persona){
        return res.status(200).send(persona);
    }
    else {
        return res.status(404).send();
    }
});

PersonaController.post("/", async (req: Request<Persona>, res: Response): Promise<Response<Persona>> => {
    const p = req.body;
    p.id = uuidv4();
    PERSONAS.push(p);

    return res.status(201).send(p);
});

PersonaController.put("/", async (req: Request<Persona>, res: Response): Promise<Response<Persona>> => {
    var i = PERSONAS.findIndex(x=> x.id == req.body.id);
    PERSONAS[i] =  req.body;

    return res.status(200).send(PERSONAS[i]);
});

PersonaController.patch("/:id/apellido/:valor", async (req: Request, res: Response): Promise<Response<Persona>> => {
    var i = PERSONAS.findIndex(x=> x.id == req.params.id);
    PERSONAS[i].apellido = req.params.valor;
    return res.status(200).send(PERSONAS[i]);
});

PersonaController.delete("/:id", async (req: Request, res: Response): Promise<Response<Persona>> => {
    PERSONAS = PERSONAS.filter(x=> x.id != req.params.id);
    return res.status(200).send();
});







export default PersonaController;