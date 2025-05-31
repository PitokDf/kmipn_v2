"use client";

import { Preliminary } from "@/components/features/participant/submission/Preliminary";

export default function SubmissionsPage() {

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Submissions</h1>
                    <p className="text-muted-foreground">
                        Submit your final submission for competition rounds
                    </p>
                </div>
            </div>

            <Preliminary />
        </>
    );
}