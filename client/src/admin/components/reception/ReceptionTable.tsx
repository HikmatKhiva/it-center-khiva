import { Stack, Table } from "@mantine/core";
import ImageModal from "../ImageModal";
import ReceptionUpdateModal from "./ReceptionUpdateModal";
import ReceptionDeleteModal from "./ReceptionDeleteModal";
import ProfileQrCode from "../../../common/components/profile/ProfileQrCode";
import ReceptionStatusUpdate from "./ReceptionStatusUpdate";
const ReceptionTable = ({ profiles }: { profiles: IUserProfile[] }) => {
  const rows =
    Array.isArray(profiles) &&
    profiles.map((profile: IUserProfile, index: number) => (
      <Table.Tr key={index}>
        <Table.Td> {profile.username}</Table.Td>
        <Table.Td>
          <ImageModal
            firstName={profile.username}
            photo={profile?.photo_url || ""}
          />
        </Table.Td>
        <Table.Td>{profile && <ProfileQrCode profile={profile} />}</Table.Td>
        <Table.Td>
          <ReceptionStatusUpdate profile={profile} />
        </Table.Td>
        <Table.Td>
          <ReceptionUpdateModal profile={profile} />
        </Table.Td>
        <Table.Td>
          <ReceptionDeleteModal id={profile.id} />
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <div>
      <Stack className="h-[calc(100vh_-_140px)]" justify="space-between">
        <Table withTableBorder highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Username</Table.Th>
              <Table.Th>Rasm</Table.Th>
              <Table.Th>Auth</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>O'zgartirish</Table.Th>
              <Table.Th>O'chirish</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {/* <Pagination
                value={query.page}
                hidden={(data?.totalPages ?? 0) <= 1 || isPending}
                onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
                total={data?.totalPages || 1}
              /> */}
      </Stack>
    </div>
  );
};
export default ReceptionTable;