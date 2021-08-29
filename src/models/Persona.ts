export interface Persona{
    id: number;
    name: string;
    lastName: string;
    email: string;
    birthDay: Date;
    recordDate: Date;
    idTipoDocumento: number;
    nombreTipoDocumento: string;
}

export default interface TipoDocumento{
    id: number;
    name: string;
}