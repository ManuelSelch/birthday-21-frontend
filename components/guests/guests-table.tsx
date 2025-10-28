"use client";
import { Anchor, Button, Stack, Table, TextInput } from "@mantine/core";
import { useState } from "react";

export default function GuestsTable({guests}: {guests: any[]}) {
    const [search, setSearch] = useState("");

    const filteredGuests = guests.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    const rows = filteredGuests.map(g => (
        <Table.Tr key={g._id}>
            <Table.Td>{g.name}</Table.Td>
            <Table.Td>{parse(g.accepted)}</Table.Td>
            <Table.Td>{parse(g.checked_in)}</Table.Td>
            <Table.Td>
                <Anchor href={`https://geburtstag.manuelselch.de/invite?id=${g._id}`}>
                    <Button>Invite</Button>
                </Anchor>
                
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack pt="md">
            <TextInput
                placeholder="Search guest by name..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                radius="md"
            />

            <Table mt="md">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Accepted</Table.Th>
                        <Table.Th>Checked In</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Stack>
    )
}

function parse(value: any) {
    if(value == undefined)
        return "--"
    return (value == true) ? "✓" : "✖"
}