"use client";
import { Anchor, Button, Stack, Table, TextInput } from "@mantine/core";
import { useState } from "react";

export default function OrdersTable({orders}: {orders: any[]}) {
    const [search, setSearch] = useState("");

    const filderedOrders = orders.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
    );

    const rows = filderedOrders.map(o => (
        <Table.Tr key={o._id}>
            <Table.Td>{o.name}</Table.Td>
            <Table.Td>{num(o.points)}</Table.Td>
            <Table.Td></Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack pt="md">
            <TextInput
                placeholder="Search order by name..."
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