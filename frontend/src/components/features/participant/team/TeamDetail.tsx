import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTeamMemberByUserID } from "@/lib/apis/team_member";
import { useQuery } from "@tanstack/react-query";

export function TeamDetail() {
    const { data } = useQuery({
        queryKey: ["teamMemberData"],
        queryFn: getTeamMemberByUserID
    })
    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Details</CardTitle>
                <CardDescription>
                    Lihat informasi tim kamu
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="team-name">Nama Tim</Label>
                        <Input id="team-name" value={data?.teamName} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Input id="category" value={data?.categori} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="institution">Asal Politeknik</Label>
                        <Input id="institution" value={data?.institution} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lecture">Dosen Pendamping</Label>
                        <Input id="lecture" value={data?.lectureName} disabled />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}