import { Stack, Text, Title } from "@mantine/core";

export default function InvitationHeader() {
    return (
        <Stack align="center">
            <Title order={1} className="text-5xl font-bold text-amber-400">Casino Nacht 2025</Title>
            <Text className="text-gray-300 mt-2">Unsere 20. Geburtstagsfeier</Text>
        </Stack>
    )
}