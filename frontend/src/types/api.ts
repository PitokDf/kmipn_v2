import { ChangeEventHandler, HTMLAttributes } from "react"

export interface DashboardData {
    id: number
    name: string
    verified: boolean
    proposal: string
    submission: Submission
    category: string
    institution: string
    lecture: Lecture
    teamMember: TeamMember[]
}

export interface Submission {
    id: number
    teamId: number
    round: string
    title: string
    githubUrl: string
    fileUrl: string
    fileName: string
    status: string
    createdAt: string
    updatedAt: string
    teamName: string
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    verified: boolean;
    role: 'admin' | 'operator' | 'participant';
    createdAt: string | Date
}

export interface Team {
    id: number
    name: string
    createdAt: string
    category: string
    institution: string
    members: TeamMember[],
    lecture: string
    status: "verified" | "pending"
    proposalLink: string | null
}

export interface Lecture {
    name: string
    nip: string
}

export type InputProps = {
    className?: HTMLAttributes<HTMLDivElement> | string,
    value: string | number | any,
    onChange: any,
    name?: string,
    id?: string
}

export interface CategoryStatsData {
    categoryStats: CategoryStats[]
    totalTeams: number
    totalProposals: number
    submissionRate: number
}

export interface CategoryStats {
    name: string
    teams: number
    proposals: number
    daysUntilDeadline: number
    submissionRate: number
}

export interface Category {
    id: number,
    categoriName: string,
    description: string,
    deadline: string | Date
}

export interface Proposal {
    id: number
    fileLink: string
    title: string
    creadAt: string
    status: string
    fileName: string
    deadline: string
    comments: string
    createdAt: Date | string
    updatedAt: Date | string
    teamName: string
    teamCategory: string
}

export interface TeamMemberData {
    teamID: number
    teamName: string
    categori: string
    institution: string
    lectureName: string
    teamMembers: TeamMember[]
}

export interface DashboardAdmin {
    totalTeam: number
    submittedProposal: number
    rejectedProposal: number
    approveProposal: number
    pendingProposal: number
    teamCategoryData: TeamCategoryData[]
    recentTeams: RecentTeam[]
    recentProposal: RecentProposal[]
}

export interface TeamCategoryData {
    name: string
    count: number
}

export interface RecentTeam {
    teamName: string
    createdAt: string
    category: string
}

export interface RecentProposal {
    proposalTitle: string
    proposalTeam: string
    createdAt: string
}


export interface TeamMember {
    name: string
    nim: string
    email: string
    noWA: string
    role: string
    prodi: string
    fileKTM: string
}