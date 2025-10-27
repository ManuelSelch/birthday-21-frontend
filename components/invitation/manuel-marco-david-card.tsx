import { Card, Group, Image, Text } from "@mantine/core";
import manuelMarco from "@/img/manuel_marco.jpg"
import david from "@/img/david.jpg"

export default function ManuelMarcoCardDavid() {
    return (
        <Group w="full" grow>
            <Card mt="md" radius="lg" shadow="md" p="0">
                <Image src={manuelMarco.src} h="200px"/>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex">
                    <Text c="white" className="absolute bottom-2 right-3 text-base font-semibold drop-shadow-md">Wir werden 20</Text>
                </div>
            </Card>

            <Card mt="md" radius="lg" shadow="md" p="0">
                <Image src={david.src} h="200px"/>
            </Card>
        </Group>
    )
}