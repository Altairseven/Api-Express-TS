import express, { Application, Request, Response } from "express";
import PersonaController from "./controllers/PersonaController";

const app: Application = express();
const port = 3001;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/persona", PersonaController);






// app.post("/persona", async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({ message: "recontra muerto" });
// });
// app.put("/persona", async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({ message: "recontra muerto" });
// });
// app.patch("/persona", async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({ message: "recontra muerto" });
// });
// app.patch("/persona/updateFechaCompra", async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({ message: "recontra muerto" });
// });
// app.patch("/persona/updatefechaNacimiento", async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({ message: "recontra muerto" });
// });
// app.delete("/persona", async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({ message: "recontra muerto" });
// });






try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured: ${error.message}`);
}