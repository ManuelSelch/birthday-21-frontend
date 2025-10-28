import GuestsTable from "@/components/guests/guests-table";
import cockpit from "@/lib/cockpit";
import { Card, Container, Table, Title } from "@mantine/core";

export default async function GuestsPage() {
    const guests = await cockpit.getItems("guests");
    
    return (
        <Container>
            <Title>Gästeliste</Title>
            <GuestsTable guests={guests}/>
        </Container>
    )
}