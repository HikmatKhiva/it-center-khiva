import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useState } from "react";
import {
  Badge,
  Group,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { GraduationCap, LoaderCircle, Search } from "lucide-react";
import CertificateTable from "@/common/components/CertificateTable";
import { Server } from "@/api/api";
import { ICertificateResponse } from "@/types";
import { currentYearQuery, years } from "@/config";
import { NumberTicker } from "@/animation/number-ticker";
const CertificatePage = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    passportId: "",
    page: 1,
    limit: 12,
    year: currentYearQuery || "",
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    year: query.year,
    passportId: query.passportId,
  });
  const { data, isPending } = useQuery<ICertificateResponse>({
    queryKey: [
      "certificates",
      query.name,
      query.page,
      query.year,
      query.passportId,
    ],
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
        <Group align="center">
          <Text size="xl">Tayor Sertificatlar</Text>
          <Badge color="grape" size="md">
            <NumberTicker
              className="text-white"
              value={Number(data?.totalCount) || 0}
            />
          </Badge>
          <GraduationCap />
        </Group>
        <Group>
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
            placeholder="O'quvchi ismi..."
          />
          <TextInput
            className="self-end"
            fz="sm"
            size="sm"
            value={query.passportId}
            rightSection={
              isPending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )
            }
            onChange={(event) =>
              setQuery({ ...query, passportId: event.target.value })
            }
            placeholder="O'quvchi passportId..."
          />
          <Select
            defaultValue={query.year}
            placeholder="2025"
            data={years}
            value={query.year}
            onChange={(value) => setQuery({ ...query, year: value || "" })}
            w={90}
          />
        </Group>
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
