import GuestsTable from "@/components/guests/guests-table";
import cockpit from "@/lib/cockpit";
import { Card, Container, Table, Title } from "@mantine/core";

// re-invalidate cache every second
export const revalidate = 1;

export default async function GuestsPage() {
    const guests = await cockpit.getItems("guests");
    
    return (
        <Container>
            <Title>Gästeliste</Title>
            <GuestsTable guests={guests}/>
        </Container>
    )
}