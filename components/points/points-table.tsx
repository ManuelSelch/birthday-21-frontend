"use client";
import api from "@/lib/api";
import cockpit from "@/lib/cockpit";
import { Anchor, Button, Group, NumberInput, Stack, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

export default function PointsTable() {
    const [search, setSearch] = useState("");
    const [points, setPoints] = useState<Record<string, number>>({});

    const [guests, setGuests] = useState<any[]>([]);

    const sortedGuests = guests.sort((a, b) => num(b.points) - num(a.points));
    const filteredGuests = sortedGuests.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    const fetchGuests = async () => {
        const data = await api.getGuests();
        setGuests(data);
    };

    const handleChange = (id: string, value: number | string) => {
        setPoints(prev => ({ ...prev, [id]: Number(value) }));
    };

    const handleSave = async (g: any) => {
        const newValue = points[g._id] ?? g.points;
        await api.setPoints(g, newValue);
        await fetchGuests();
    };

    useEffect(() => {
        fetchGuests();
    }, [])

    const rows = filteredGuests.map(g => {
        const currentValue = points[g._id] ?? g.points ?? 0;
        const unsaved = currentValue !== (g.points ?? 0); // check if value changed

        return (    
            <Table.Tr key={g._id}
                style={{backgroundColor: unsaved ? 'rgba(255, 235, 59, 0.2)' : undefined}}    
            >
                <Table.Td>{g.name}</Table.Td>
                <Table.Td>
                    <NumberInput 
                        placeholder="new" maw={100} 
                        value={currentValue}
                        onChange={val => handleChange(g._id, val ?? 0)}
                    />
                </Table.Td>
                <Table.Td>
                <Button 
                    maw={80} 
                    onClick={() => { handleSave(g)}}
                    color={unsaved ? 'yellow' : 'gray'}
                >Save</Button>
                </Table.Td>
            </Table.Tr>
        )
    });

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