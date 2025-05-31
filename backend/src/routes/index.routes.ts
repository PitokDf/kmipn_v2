import { Router } from "express";
import authRouter from "./auth.routes";
import dashboardRouter from "./dashboard.route";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import proposalRouter from "./propsal.routes";
import { uploadDrive } from "../middlewares/multerDrive";
import teamMemberRouter from "./team_member.routes";
import categoryRouter from "./category.routes";
import teamRouter from "./team.routes";
import userRouter from "./user.routes";
import submissionRouter from "./submissions.routes";

const apiRoute = Router()

apiRoute.use("/auth", authRouter)
apiRoute.use("/dashboard", jwtCheckToken, dashboardRouter)
apiRoute.use("/proposals", jwtCheckToken, proposalRouter)
apiRoute.use("/team-member", jwtCheckToken, teamMemberRouter)
apiRoute.use("/category", categoryRouter)
apiRoute.use("/teams", jwtCheckToken, teamRouter)
apiRoute.use("/users", jwtCheckToken, userRouter)
apiRoute.use("/submissions", jwtCheckToken, submissionRouter)

export default apiRoute