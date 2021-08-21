import express, { Request, Response } from "express";

const PersonaController = express.Router();

PersonaController.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: "Persona" });
});



export default PersonaController;