"use client";
import { Anchor, Button, Stack, Table, TextInput } from "@mantine/core";
import { useState } from "react";

export default function PointsTable({guests}: {guests: any[]}) {
    const [search, setSearch] = useState("");

    const sortedGuests = guests.sort((a, b) => num(b.points) - num(a.points));
    const filteredGuests = sortedGuests.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    const rows = filteredGuests.map(g => (
        <Table.Tr key={g._id}>
            <Table.Td>{g.name}</Table.Td>
            <Table.Td>{num(g.points)}</Table.Td>
            <Table.Td>
               
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
                        <Table.Th>Punkte</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Stack>
    )
}

function num(value: any) {
    if(value == undefined)
        return 0;
    return value;
}