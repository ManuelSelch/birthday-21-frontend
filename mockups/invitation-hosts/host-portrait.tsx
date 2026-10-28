import { useState } from 'react';
import { Avatar, FileButton, UnstyledButton } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

export function HostPortrait({ name, initialPhoto }: { name: string; initialPhoto: string | null }) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  function choosePhoto(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  }
  return <figure className="host">
    <FileButton onChange={choosePhoto} accept="image/png,image/jpeg,image/webp">
      {(props) => <UnstyledButton {...props} className="portrait-button" aria-label={`Foto für ${name} wählen`}>
        <Avatar src={photo} alt={photo ? name : ''} radius="50%" className="portrait">
          <IconUser size={35} stroke={1.2} aria-hidden="true" />
        </Avatar>
      </UnstyledButton>}
    </FileButton>
    <figcaption>{name}</figcaption>
  </figure>;
}
