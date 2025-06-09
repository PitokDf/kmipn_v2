-- CreateIndex
CREATE INDEX "Assesment_proposalId_idx" ON "Assesment"("proposalId");

-- CreateIndex
CREATE INDEX "Assesment_juriId_idx" ON "Assesment"("juriId");

-- CreateIndex
CREATE INDEX "File_usage_idx" ON "File"("usage");

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE INDEX "Proposal_teamId_idx" ON "Proposal"("teamId");

-- CreateIndex
CREATE INDEX "Proposal_fileId_idx" ON "Proposal"("fileId");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "Submission_teamId_idx" ON "Submission"("teamId");

-- CreateIndex
CREATE INDEX "Submission_round_idx" ON "Submission"("round");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

-- CreateIndex
CREATE INDEX "Team_categoryId_idx" ON "Team"("categoryId");

-- CreateIndex
CREATE INDEX "Team_lectureId_idx" ON "Team"("lectureId");

-- CreateIndex
CREATE INDEX "Team_verified_idx" ON "Team"("verified");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE INDEX "TeamMember_fileKtmId_idx" ON "TeamMember"("fileKtmId");

-- CreateIndex
CREATE INDEX "TeamMember_role_idx" ON "TeamMember"("role");

-- CreateIndex
CREATE INDEX "Timeline_startTime_idx" ON "Timeline"("startTime");

-- CreateIndex
CREATE INDEX "Timeline_endTime_idx" ON "Timeline"("endTime");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserToken_userId_idx" ON "UserToken"("userId");

-- CreateIndex
CREATE INDEX "UserToken_expiresAt_idx" ON "UserToken"("expiresAt");
