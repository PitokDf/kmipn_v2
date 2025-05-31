'use client'

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from ""
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { saveTeamMember } from "@/lib/apis/team_member"
// import OptionCategoryLomba from "./OptionCategoriLomba"
import { useQuery } from "@tanstack/react-query"
import { getAllCategory } from "@/lib/apis/category"
import { ListPoliteknik } from "./ListPoliteknik"
import { useUser } from "@/context/UserContext"

const formSchema = z.object({
  teamName: z.string().min(3, "Nama tim minimal 3 karakter"),
  category: z.string().min(1, "Pilih kategori lomba"),
  polytechnic: z.string().min(3, "Asal politeknik wajib diisi"),
  supervisor: z.string().min(3, "Nama dosen pembimbing wajib diisi"),
  nip: z.string().length(18, "NIP dosen pembimbing harus 18 digit"),
  members: z.array(
    z.object({
      name: z.string().min(3, "Nama anggota minimal 3 karakter"),
      nim: z.string().length(12, "NIM harus 12 digit"),
      prodi: z.string().nonempty("Prodi wajib diisi"),
      email: z.string().email("Email tidak valid"),
      noWa: z.string().nonempty("Nomor WhatsApp Wajib diisi"),
      ktm: z
        .any()
        .refine((files) => files?.length === 1, "Foto KTM wajib diupload")
        .refine(
          (files) =>
            files?.[0]?.type.startsWith("image/"),
          "File KTM harus berupa gambar"
        ),
    })
  ).min(1, "Minimal harus ada 1 anggota tim"),
})

type FormValues = z.infer<typeof formSchema>

export default function CompleteForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { data, isPending, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory
  })
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      category: "",
      polytechnic: "",
      supervisor: "",
      nip: "",
      members: [
        {
          name: "",
          nim: "",
          prodi: "",
          email: "",
          noWa: "",
          ktm: null,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)
      console.log(data);
      const formData = new FormData()
      formData.append("teamName", data.teamName)
      formData.append("category", data.category)
      formData.append("polytechnic", data.polytechnic)
      formData.append("supervisor", data.supervisor)
      formData.append("nip", data.nip)

      data.members.forEach((member, index) => {
        formData.append(`members[${index}][name]`, member.name)
        formData.append(`members[${index}][nim]`, member.nim)
        formData.append(`members[${index}][prodi]`, member.prodi)
        formData.append(`members[${index}][email]`, member.email)
        formData.append(`members[${index}][noWa]`, member.noWa)
      })
      const files = data.members.map((mem) => mem.ktm)
      data.members.forEach((member, index) => {
        if (member.ktm && member.ktm.length > 0) {
          formData.append(`ktm_agg${index + 1}`, member.ktm[0]); // pastiin yang dimasukin beneran File
        }
      });

      const res = await saveTeamMember(formData)
      toast.success("Data tim berhasil disubmit")
      document.location.reload()
      // redirect atau reset form
    } catch (error) {
      toast.error("Gagal submit data, coba lagi")
    } finally {
      setIsLoading(false)
    }
  }

  const user = useUser()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  mx-auto ">
        {/* Nama Tim */}
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Tim</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} placeholder="Masukkan nama tim" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kategori */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Lomba</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori lomba" />
                </SelectTrigger>
                <SelectContent>
                  {isPending ? (
                    <SelectItem value="eee">Loading...</SelectItem>
                  ) :
                    data?.map((k) => (
                      <SelectItem key={k.id} value={String(k.id)}>
                        {k.categoriName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Asal Politeknik */}
        <FormField
          control={form.control}
          name="polytechnic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asal Politeknik</FormLabel>
              <FormControl>
                <ListPoliteknik onValueChange={field.onChange} value={field.value} />
                {/* <Input {...field} disabled={isLoading} placeholder="Masukkan asal politeknik" /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dosen Pembimbing */}
        <FormField
          control={form.control}
          name="supervisor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dosen Pembimbing</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} placeholder="Nama dosen pembimbing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP Dosen Pendamping</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} placeholder="NIP dosen pendamping" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Anggota Tim */}
        <div>
          <h3 className="font-semibold mb-2">Data Anggota Tim</h3>
          {fields.map((member, index) => (
            <div key={member.id} className="mb-6 border p-4 rounded-md ">
              <FormField
                control={form.control}
                name={`members.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{index === 0 ? "Nama Ketua" : "Nama Anggota"}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} placeholder={index === 0 ? "Nama Ketua" : "Nama Anggota"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`members.${index}.nim`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} placeholder={index === 0 ? "NIM Ketua" : "NIM Anggota"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`members.${index}.prodi`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prodi</FormLabel>
                    <Input {...field} disabled={isLoading} placeholder={index === 0 ? "Prodi Ketua" : "Prodi Anggota"} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`members.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        value={index === 0 ? user?.email : field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        placeholder={index === 0 ? "Email Ketua" : "Email Anggota"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`members.${index}.noWa`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} placeholder={index === 0 ? "Nomor WhatsApp Ketua" : "Nomor WhatsApp Anggota"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`members.${index}.ktm`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Foto KTM (image)</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        className="ml-3"
                        onChange={(e) => field.onChange(e.target.files)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
                disabled={isLoading || fields.length === 1}
                className="mt-2"
              >
                Hapus Anggota
              </Button>
            </div>
          ))}
          {fields.length < 3 && (
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-500/80 text-white"
              onClick={() => append({ name: "", nim: "", prodi: "", email: "", ktm: null, noWa: "" })}
              disabled={isLoading}
            >
              Tambah Anggota
            </Button>
          )}
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Data Tim"}
        </Button>
      </form>
    </Form>
  )
}
