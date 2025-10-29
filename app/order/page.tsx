import cockpit from "@/lib/cockpit";
import { Alert, Button, Card, Container, NumberInput, Select, Stack, Title } from "@mantine/core";

export default async function Order({searchParams}: {
  searchParams: Promise<{ [key: string]: string }>
}) {
    const id = (await searchParams)?.id;
    const guest = id ? await cockpit.getItem("guests", id) : null;

    const drinks = await cockpit.getItems("drinks");
    const menu = drinks.map(d => d.name);

    return (
        <Stack m="md">
            {id == undefined 
                ? <Alert color="red">Unknown guest, please use your invitation ticket</Alert>
                : <Alert>Hallo {guest.name}</Alert>
            }

            <Card shadow="md" withBorder>
                <Stack>
                    <Title order={4} mb="md">Bestelle deine Getränke</Title>
                    <Select data={menu} label="Getränk auswählen"/>
                    <NumberInput label="Menge" min={1} value={1}/>
                    <NumberInput label="Tischnummer" min={1}/>
                    <Button color="yellow" mt="md">Bestellen</Button>
                </Stack>
            </Card>
        </Stack>
    )
}