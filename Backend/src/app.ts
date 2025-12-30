import express , {type Request, type Response, type NextFunction} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.send("Hello, World!");
});

export default app;