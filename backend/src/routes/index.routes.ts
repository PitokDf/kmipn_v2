import { Router } from "express";
import authRouter from "./auth.routes";
import dashboardRouter from "./dashboard.route";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import proposalRouter from "./propsal.routes";
import teamMemberRouter from "./team_member.routes";
import categoryRouter from "./category.routes";
import teamRouter from "./team.routes";
import userRouter from "./user.routes";
import submissionRouter from "./submissions.routes";
import reportRouter from "./report.routes";
import { getStatsController } from "../controllers/dashboard.controller";

const apiRoute = Router()

apiRoute.use("/auth", authRouter)
apiRoute.use("/dashboard", jwtCheckToken, dashboardRouter)
apiRoute.use("/proposals", jwtCheckToken, proposalRouter)
apiRoute.use("/team-member", jwtCheckToken, teamMemberRouter)
apiRoute.use("/category", categoryRouter)
apiRoute.use("/teams", jwtCheckToken, teamRouter)
apiRoute.use("/users", jwtCheckToken, userRouter)
apiRoute.use("/submissions", jwtCheckToken, submissionRouter)
apiRoute.use("/reports", jwtCheckToken, reportRouter)
apiRoute.get("/statistik", getStatsController)

export default apiRoute