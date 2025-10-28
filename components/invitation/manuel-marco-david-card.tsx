import { Card, Group, Image, Text } from "@mantine/core";
import manuelMarco from "@/img/manuel_marco.jpg"
import david from "@/img/david.jpg"

export default function ManuelMarcoCardDavid() {
    return (
        <Group w="full" grow>
            <Card mt="md" radius="lg" shadow="md" p="0">
                <Image src={manuelMarco.src} h="200px"/>
                
            </Card>

            <Card mt="md" radius="lg" shadow="md" p="0">
                <Image src={david.src} h="200px"/>
            </Card>
        </Group>
    )
}