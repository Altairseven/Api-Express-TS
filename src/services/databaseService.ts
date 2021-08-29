import mysql, { Connection } from "mysql2";


export interface ExecutedResult {
    affectedRows: number;
    fieldCount: number;
    info: string;
    insertId: number;
    serverStatus: number;
    warningStatus: number;
}


function getConnection() {
    try {
        const con = mysql.createConnection({
            host: "192.168.1.6",
            port: 3306,
            user: "practica",
            password: "practica",
            database: "practica",
        });

        console.log("Connected succesfully to MYSQL database");
        return con;
    } catch (error) {
        console.log("Failed to connect to MYSQL database")
        throw error;
    }
};

export class DatabaseService {
    __db: Connection;

    constructor() {
        this.__db = getConnection();
    }
    
    mapArray<T>(r: any) {
        const results = r;

        const array = new Array<T>();
        for (let i = 0; i < r.length; i++) {
            const x = r[i];
            const obj = {};
            for (const key in x) {
                if (Object.prototype.hasOwnProperty.call(x, key)) {
                    obj[key] = x[key];
                }
            }
            array.push(obj as T);
        }
        return array;
    }

    MapSingle<T>(r: any): T {
        const x = r[0];
        const obj = {};
        for (const key in x) {
            if (Object.prototype.hasOwnProperty.call(x, key)) {
                obj[key] = x[key];

            }
        }
        return obj as T;
    }


    async query<T>(sql: string, values: any | any[] | { [param: string]: any } = []): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            this.__db.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                var mapped = this.mapArray<T>(result);
                resolve(mapped);
            });
        });
    }

    async querySingle<T>(sql: string, values: any | any[] | { [param: string]: any }): Promise<T> {
        return new Promise((resolve, reject) => {
            this.__db.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                }

                var mapped = this.MapSingle<T>(result);
                resolve(mapped);


            });
        });
    }

    async Execute(sql: string, values: any | any[] | { [param: string]: any } = []): Promise<ExecutedResult> {
        console.log("db","Excecuting", sql, values);

        return new Promise((resolve, reject) => {
            this.__db.execute(sql, values, (err, result) => {
                if (err)
                    reject(err);
                else {
                    console.log("db","onExecuted", result);
                    resolve(result as ExecutedResult);

                }

            })


        });
    }




    async beginTransaction(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.__db.beginTransaction((error) => {
                if (error)
                    reject(error);
                else {
                    console.log("db", "Transaccion Started");
                    resolve();
                }
                    
            });
        })

    }

    async commitTransaction(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.__db.commit((error) => {
                if (error)
                    reject(error);
                else {
                    console.log("db", "Transaccion Commited");
                    resolve();
                }
                    
            });
        })

    }

    async rollbackTransaction(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.__db.rollback(() => {
                console.log("db", "Transaccion Rollback Performed");
                resolve();
            });
        })

    }


}