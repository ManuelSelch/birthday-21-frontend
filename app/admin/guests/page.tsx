import GuestsTable from "@/components/guests/guests-table";
import cockpit from "@/lib/cockpit";
import { IconScan } from '@tabler/icons-react';
import { Anchor, Container, Group, Stack, Title } from "@mantine/core";

// re-invalidate cache every second
export const revalidate = 1;

export default async function GuestsPage() {
    const guests = await cockpit.getItems("guests");
    
    return (
        <Container>
            <Group>
                <Title w={700}>Gästeliste</Title>
                <Anchor href="/admin/scanner"><IconScan size="40"/></Anchor>
            </Group>

            <GuestsTable guests={guests}/>
        </Container>
    )
}