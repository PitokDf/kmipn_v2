'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { getAllTimeline } from "@/lib/apis/timeline";
import { formatTanggal } from "@/lib/formatTanggal";
import { useQuery } from "@tanstack/react-query";
import { HTMLAttributes } from "react";

type TimelineStatus = "completed" | "current" | "upcoming";

function getDateOnly(dateStr: string) {
    return new Date(dateStr).toISOString().split("T")[0];
}


function getTimelineStatus(date: string, index: number, timeline: { date: string }[]): TimelineStatus {
    const today = new Date().toISOString().split("T")[0];
    const eventDate = getDateOnly(date);
    const nextEventDate = timeline[index + 1] ? getDateOnly(timeline[index + 1].date) : null;

    if (eventDate < today && (!nextEventDate || nextEventDate > today)) {
        return "current";
    } else if (eventDate < today) {
        return "completed";
    } else {
        return "upcoming";
    }
}

export function TimeLineInfo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    const { data } = useQuery({
        queryKey: ['timelines'],
        queryFn: getAllTimeline
    })

    const rawTimeline = data?.map((time) => ({
        id: time.id,
        title: time.title,
        description: time.description,
        date: time.startTime as string
    }))

    const competitionTimeline = rawTimeline?.map((item, index, arr) => ({
        ...item,
        status: getTimelineStatus((item?.date as string), index, arr),
    }));
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Competition Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <Timeline items={competitionTimeline! || []} />
            </CardContent>
        </Card>
    )
}