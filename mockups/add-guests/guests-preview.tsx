import { useState, type FormEvent } from 'react';
import { Anchor, Button, Card, Container, Group, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { IconBeer, IconScan, IconScoreboard } from '@tabler/icons-react';

export function GuestsPreview() {
  const state = new URLSearchParams(location.search).get('state');
  const [guests, setGuests] = useState(state === 'empty' ? [] : [
    { id: 1, name: 'Anna Müller', accepted: true, checkedIn: false },
    { id: 2, name: 'Max Schmidt', accepted: false, checkedIn: false },
  ]);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  function addGuest(event: FormEvent) {
    event.preventDefault();
    setSuccess('');
    if (!name.trim()) return setError('Bitte gib einen Namen ein.');
    if (state === 'error') return setError('Gast konnte nicht hinzugefügt werden. Bitte versuche es erneut.');
    setGuests(current => [...current, { id: Date.now(), name: name.trim(), accepted: false, checkedIn: false }]);
    setName('');
    setSearch('');
    setError('');
    setSuccess('Gast hinzugefügt.');
  }
  return <Container py="xl">
    <Group><Title>Gästeliste</Title>
      <Anchor href="#" aria-label="Scanner"><IconScan size={40} /></Anchor>
      <Anchor href="#" aria-label="Punkte"><IconScoreboard size={40} /></Anchor>
      <Anchor href="#" aria-label="Bestellungen"><IconBeer size={40} /></Anchor>
    </Group>
    <Card shadow="md" withBorder my="md">
      <Text>Gäste: {guests.length}</Text>
      <Text>Angenommen: {guests.filter(g => g.accepted).length}</Text>
      <Text>Mit Begleitung: {guests.filter(g => g.accepted).length}</Text>
    </Card>
    <Stack gap="xs">
      <form onSubmit={addGuest} className="guest-form">
        <TextInput label="Name" placeholder="Name des Gastes" value={name} onChange={event => setName(event.currentTarget.value)} maxLength={100} error={error || undefined} />
        <Button type="submit">Gast hinzufügen</Button>
      </form>
      {success && <Text role="status" c="green" size="sm">{success}</Text>}
      <TextInput mt="md" placeholder="Search guest by name..." aria-label="Gäste suchen" value={search} onChange={event => setSearch(event.currentTarget.value)} />
      <Table mt="md"><Table.Thead><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Accepted</Table.Th><Table.Th>Checked In</Table.Th><Table.Th>Action</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody>{guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase())).map(g => <Table.Tr key={g.id}>
          <Table.Td>{g.name}</Table.Td><Table.Td>{g.accepted ? '✓' : '✖'}</Table.Td><Table.Td>{g.checkedIn ? '✓' : '✖'}</Table.Td>
          <Table.Td><Button>Invite</Button></Table.Td>
        </Table.Tr>)}</Table.Tbody>
      </Table>
    </Stack>
  </Container>;
}
