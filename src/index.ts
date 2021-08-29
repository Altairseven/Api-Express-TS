import express, { Application, Request, Response } from "express";
import PersonaController from "./controllers/PersonaControllerfinal";
import cors from "cors";

const app: Application = express();
const port = 3001;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        methods: "*",
        origin: "*",
        allowedHeaders: "*",
    })
);

app.use("/persona", PersonaController);


try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured: ${error.message}`);
}