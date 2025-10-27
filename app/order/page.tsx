import { Button, Card, Container, NumberInput, Select, Stack, Title } from "@mantine/core";

export default function Order() {
    const menu = ["A", "B", "C"]

    return (
        <div>
            <Card>
                <Stack>
                    <Title order={4} mb="md">Bestelle deine Getränke</Title>
                    <Select data={menu} label="Getränk auswählen"/>
                    <NumberInput label="Menge" min={1}/>
                    <NumberInput label="Tischnummer" min={1}/>
                    <Button color="yellow" mt="md">Bestellen</Button>
                </Stack>
            </Card>
        </div>
    )
}