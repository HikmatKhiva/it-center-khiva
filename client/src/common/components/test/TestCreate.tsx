import { Card, Grid, Stack,  TextInput } from "@mantine/core";
const TestCreate = () => {
  return (
    <div>
      <Stack>
        <Card>
          <TextInput placeholder="Savolni kiriting!" />
          <Grid mt={15}>
            <Grid.Col span={6}>
              <TextInput
                flex={1}
                label="A. (SMM & Mobilografiya)"
                placeholder="SMM & Mobilografiya"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                flex={1}
                label="B. Front End"
                placeholder="Front End"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                flex={1}
                label="C. Backend"
                placeholder="Backend"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                flex={1}
                label="D. Kompyuter Savodxonligi"
                placeholder="Kompyuter Savodxonligi"
              />
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    </div>
  );
};

export default TestCreate;
