import CompleteForm from "@/components/features/participant/team/CompleteForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function () {
    return (
        <div className="space-y-3">
            <Alert>
                <AlertDescription>
                    Pastikan data tim dan anggota sudah benar sebelum disubmit.
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                    <CardTitle>Team Details</CardTitle>
                    <CardDescription>
                        View and update your team information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CompleteForm />
                </CardContent>
            </Card>
        </div>
    )
}