import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { HTMLAttributes } from "react";

type TimelineStatus = "completed" | "current" | "upcoming";

function getTimelineStatus(date: string, index: number, timeline: { date: string }[]): TimelineStatus {
    const now = new Date();
    const eventDate = new Date(date);

    const nextEventDate = timeline[index + 1] ? new Date(timeline[index + 1].date) : null;

    if (eventDate < now && (!nextEventDate || nextEventDate > now)) {
        return "current";
    } else if (eventDate < now) {
        return "completed";
    } else {
        return "upcoming";
    }
}

const rawTimeline = [
    {
        title: "Pendaftaran Dibuka",
        date: "Januari 1, 2025",
        description: "Tim mulai mendaftar",
    },
    {
        title: "Mengirimkan Proposal",
        date: "February 15, 2025",
        description: "Deadline for proposal submission",
    },
    {
        title: "Preliminary Round",
        date: "Mai 1, 2025",
        description: "Preliminary judging and selection",
    },
    {
        title: "Final Round",
        date: "September 15, 2025",
        description: "Final presentations and awards",
    },
];

const competitionTimeline = rawTimeline.map((item, index, arr) => ({
    ...item,
    status: getTimelineStatus(item.date, index, arr),
}));


export function TimeLineInfo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Competition Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <Timeline items={competitionTimeline} />
            </CardContent>
        </Card>
    )
}