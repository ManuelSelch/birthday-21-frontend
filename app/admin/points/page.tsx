import cockpit from "@/lib/cockpit";
import { IconUsers } from '@tabler/icons-react';
import { Anchor, Container, Group, Text, Title } from "@mantine/core";
import PointsTable from "@/components/points/points-table";

export default async function GuestsPage() {
    const guests = await cockpit.getItems("guests");

    return (
        <Container>
            <Group>
                <Title>Punktestand</Title>
                <Anchor href="/admin/guests"><IconUsers /></Anchor>
            </Group>

            <PointsTable guests={guests}/>
        </Container>
    )
}