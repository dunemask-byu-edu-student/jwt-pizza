const REQUIRED_ENVARS = [
    "ADMIN_PASSWORD", // Admin Password    
] as const;

const missingEnvars: string[] = REQUIRED_ENVARS.filter((envar) => !process.env[envar]);
declare type Envars = { [key in (typeof REQUIRED_ENVARS)[number]]: string } & Record<string, string | null>;
const ENV = process.env as Envars;


export const CONFIG = {
    ORIGIN: "http://localhost:5173",
    ADMIN_EMAIL: "a@jwt.com",
    ADMIN_PASSWORD: ENV.ADMIN_PASSWORD,
    TIMEOUTS: {
        xs: 100,
        sm: 250,
        md: 500,
        lg: 750,
        xl: 1000,
        xxl: 2500,
    }
};

// @ts-ignore
if (missingEnvars.length > 0) throw new Error(`Missing Envars ${JSON.stringify(missingEnvars, null, 2)}`);