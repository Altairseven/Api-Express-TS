import express, { Request, Response } from "express";
import { Persona } from "../models/Persona";
import { DatabaseService } from "../services/databaseService";


const PersonaController = express.Router();

PersonaController.get("/", async (req: Request, res: Response): Promise<Response<Array<Persona>>> => {
    const _db = new DatabaseService();
    try { 
        const result = await _db.query<Persona>("SELECT a.*, b.name as nombreTipoDocumento FROM person a join tipos_documento b on a.idTipoDocumento = b.id");
        return res.status(200).send(result);
    } catch (error) {
        res.status(404).send();
    }
});

PersonaController.get("/:id", async (req: Request, res: Response): Promise<Response<Persona>> => {
    try {
        const _db = new DatabaseService();
        const result = await _db.querySingle<Persona>("SELECT a.*, b.name as nombreTipoDocumento FROM person a join tipos_documento b on a.idTipoDocumento = b.id WHERE a.id = ?", [req.params.id]);
        return res.status(200).send(result);

    } catch (error) {
        res.status(404).send();
    }
});

PersonaController.post("/", async (req: Request<Persona>, res: Response): Promise<Response<Persona>> => {
    const p = req.body;
    const _db = new DatabaseService();

    try {
        await _db.beginTransaction();

        const q = "INSERT INTO person (name, lastname, email, birthDay, recordDate, idTipoDocumento) VALUES (?,?,?,?,?,?)"
        const params = [p.name, p.lastName, p.email, new Date(p.name.birthDay), new Date(), 1];
        const result = await _db.Execute(q, params);
        
        await _db.commitTransaction();
        return res.status(201).send({ id: result.insertId, ...p });
    } catch (error) {
        await _db.rollbackTransaction();
        return res.status(500).send(error);
    }
});

PersonaController.put("/", async (req: Request<Persona>, res: Response): Promise<Response<Persona>> => {
    const _db = new DatabaseService();

    try {
        const p = req.body;

        const q = `UPDATE person set name = ?, lastName = ?, email = ?, birthDay = ?, idTipoDocumento = ? where id = ?`
        const params = [p.name, p.lastName, p.email, new Date(p.birthDay), p.idTipoDocumento, p.id];
        const result = await _db.Execute(q, params);

        return res.status(200).send({ affectedRows: result.affectedRows });
    } catch (error) {
        return res.status(500).send(error);
    }
});


PersonaController.patch("/:id/:field/:valor", async (req: Request, res: Response): Promise<Response<Persona>> => {
    const _db = new DatabaseService();
    try {

        const campo = req.params.field;
        let valor: any = req.params.valor;
        const id = req.params.id;

        if (campo == "recordDate" || campo == "id") {
            throw new Error("Cannot Update Field");
        }

        if (campo == "birthDay")
            valor = new Date(valor);

        const q = `UPDATE person set ${campo} = ? where id = ?`
        const params = [valor, id];
        const result = await _db.Execute(q, params);

        return res.status(200).send({ affectedRows: result.affectedRows });
    } catch (error) {
        return res.status(500).send(error);
    }
});

PersonaController.delete("/:id", async (req: Request, res: Response): Promise<Response<Persona>> => {
    const _db = new DatabaseService();
    try {
        const q = `DELETE from person where id = ?`
        const params = [req.params.id];
        const result = await _db.Execute(q, params);

        return res.status(200).send({ affectedRows: result.affectedRows });
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default PersonaController;