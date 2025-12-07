import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useState } from "react";
import { Group, Pagination, Stack, Text, TextInput } from "@mantine/core";
import { GraduationCap, LoaderCircle, Search } from "lucide-react";
import CertificateTable from "@/common/components/CertificateTable";
import { Server } from "@/api/api";
const CertificatePage = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  const { data, isPending } = useQuery<ICertificateResponse>({
    queryKey: ["certificates", query.name, query.page],
    queryFn: () =>
      Server<ICertificateResponse>(`certificate?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token,
  });
  return (
    <section>
      <Group mb="10" justify="space-between" align="center">
        <Group>
          <Text size="xl">Tayor Sertificatlar</Text>
          <GraduationCap />
        </Group>
        <TextInput
          className="self-end"
          fz="sm"
          size="sm"
          value={query.name}
          rightSection={
            isPending ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )
          }
          onChange={(event) =>
            setQuery({ ...query, name: event.target.value })
          }
          placeholder="O'quvchi passportId..."
        />
      </Group>
      <Stack className="h-[calc(100vh_-_140px)]" justify="space-between">
        <CertificateTable students={data?.students || []} />
        <Pagination
          value={query.page}
          hidden={(data?.totalPages ?? 0) <= 1 || isPending}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          total={data?.totalPages || 1}
        />
      </Stack>
    </section>
  );
};
export default CertificatePage;
