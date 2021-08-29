import express, { Request, Response } from "express";
import { Persona } from "../models/Persona";
import mysql from "mysql2";

function getConnection() {
    try {
        const con = mysql.createConnection({
            host: "192.168.1.6",
            user: "practica",
            password: "practica",
            database: "practica",
        });
        console.log("Connected succesfully to MYSQL database")

        return con;
    } catch (error) {
        console.log("Failed to connect to MYSQL database")
        throw error;
    }

};

const PersonaController = express.Router();





PersonaController.get("/", async (req: Request, res: Response) => {
    const _db = getConnection();
    const q = `SELECT a.*, b.name as nombreTipoDocumento 
               FROM person a 
               join tipos_documento b on a.idTipoDocumento = b.id`;

    _db.query(q, (err, result)=> {
        if (err) {
            res.status(404).send();
        }
        else {
            res.status(200).send(result);
        }
    })
});


PersonaController.get("/:id", async (req: Request, res: Response) => {
    const _db = getConnection();
    const q = "SELECT a.*, b.name as nombreTipoDocumento FROM person a join tipos_documento b on a.idTipoDocumento = b.id WHERE a.id = ?";
    const params = [req.params.id];
    _db.query(q, params, (err, result)=> {
        if (err) {
            res.status(404).send();
        }
        else {
            res.status(200).send(result[0]);
        }
    })
});


export interface ExecutedResult {
    affectedRows: number;
    fieldCount: number;
    info: string;
    insertId: number;
    serverStatus: number;
    warningStatus: number;
}


PersonaController.post("/", async (req: Request<Persona>, res: Response) => {
    const _db = getConnection();
    const p = req.body;

    const q = "INSERT INTO person (name, lastname, email, birthDay, recordDate, idTipoDocumento) VALUES (?,?,?,?,?,?)"
    const params = [p.name, p.lastName, p.email, new Date(p.name.birthDay), new Date(), 1];

    _db.execute(q, params, (err, result)=>{
        if (err) {
            res.status(500).send(err);
        }
        else {
            const anyresult = result as ExecutedResult;


            res.status(201).send({
                id: anyresult.insertId,
                ...p
            });
        }
    });

});

PersonaController.put("/", async (req: Request<Persona>, res: Response) => {
    const _db = getConnection();
    const p = req.body;
    const q = "UPDATE person set name = ?, lastName = ?, email = ?, birthDay = ?, idTipoDocumento = ? where id = ?"
    const params = [p.name, p.lastName, p.email, new Date(p.birthDay), p.idTipoDocumento, p.id];

    _db.execute(q, params, (err, result)=>{
        if (err) {
            res.status(500).send(err);
        }
        else {
            const anyresult = result as any;


            res.status(200).send({ affectedRows: anyresult.affectedRows });
        }
    });

});

PersonaController.patch("/:id/:field/:valor", async (req: Request, res: Response) => {
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

        const _db = getConnection();

        _db.execute(q, params, (err, result)=>{
            if (err) {
                res.status(500).send(err);
            }
            else {
                const anyresult = result as any;
    
    
                res.status(200).send({ affectedRows: anyresult.affectedRows });
            }
        });

    } catch (error) {
        return res.status(500).send(error);
    }

});

PersonaController.delete("/:id", async (req: Request, res: Response) => {
    const _db = getConnection();
    const q = "DELETE from person where id = ?"
    const params = [req.params.id];
 
    _db.execute(q, params, (err, result)=>{
        if (err) {
            res.status(500).send(err);
        }
        else {
            const anyresult = result as any;
            res.status(200).send({ affectedRows: anyresult.affectedRows });
        }
    });
});


export default PersonaController;