import GuestsTable from "@/components/guests/guests-table";
import cockpit from "@/lib/cockpit";
import { IconScan } from '@tabler/icons-react';
import { Anchor, Card, Container, Group, Stack, Text, Title } from "@mantine/core";

// re-invalidate cache every second
export const revalidate = 1;

export default async function GuestsPage() {
    const guests = await cockpit.getItems("guests");
    
    return (
        <Container>
            <Group>
                <Title>Gästeliste</Title>
                <Anchor href="/admin/scanner"><IconScan size="40"/></Anchor>
            </Group>

            <Card shadow="md" withBorder my="md">
                <Text>Gäste: {guests.length}</Text>
                <Text>Angenommen: {guests.filter(g => g.accepted).length}</Text>
                <Text>Mit Begleitung: {guests.filter(g => g.accepted).length + guests.filter(g => g.companion).length}</Text>
            </Card>

            <GuestsTable guests={guests}/>
        </Container>
    )
}