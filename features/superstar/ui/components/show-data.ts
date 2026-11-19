import type { ShowDefinition, ShowImage } from '../../domain/show-catalogue';
import { acts } from '../../domain/catalog';
import manuelPhoto from '../../assets/manuel.jpg';
import marcoPhoto from '../../assets/marco.jpg';
import davidPhoto from '../../assets/david.jpg';
import { IconCode, IconBoltFilled, IconHeartFilled, IconCards, IconSparkles, IconStarFilled, IconMicrophone } from '@tabler/icons-react';
export const birthday = {name:'Birthday 21', eyebrow:'DREI MAL 21 / DIE GEBURTSTAGSSHOW', title:'Ein Abend. Lauter Superstars.', description:'Unsere Bühne für eure Talente. Persönlich, ein bisschen feierlich und mit ganz viel Applaus.', question:'Welchen Preis verdient dieser Act?', answers:['Goldene Gänsehaut','Orden für maximalen Mut','Pokal der offenen Münder'], values:[27,24,49], award:'Pokal der offenen Münder', voting:'Das Publikum vergibt liebevolle Fantasiepreise. Jeder Act bekommt seinen eigenen großen Moment.'};
export const jurors = [
  {name:'Manuel', photo:manuelPhoto, label:'Sauber abgeliefert!', sub:'BEGEISTERUNG ERFOLGREICH KOMPILIERT', Icon:IconCode, color:'mint'},
  {name:'Marco', photo:marcoPhoto, label:'Volle Spannung!', sub:'ACHTUNG: HOCHSPANNUNGS-TALENT', Icon:IconBoltFilled, color:'pink'},
  {name:'David', photo:davidPhoto, label:'Zugabe!', sub:'DAVON GEHT NOCH EINE RUNDE', Icon:IconHeartFilled, color:'orange'}
];
const actIcons = { cards: IconCards, sparkles: IconSparkles, star: IconStarFilled, microphone: IconMicrophone };
export interface Performer {
  name: string; act: string; initials: string; Icon: typeof IconStarFilled; description: string; images: ShowImage[];
}
export const performers: Performer[] = acts.map(act => ({ ...act, Icon: actIcons[act.icon],
  description: 'Talent optional. Legendenstatus garantiert.', images: [] }));
export function performerFor(show: ShowDefinition): Performer {
  return { name: show.name, act: show.title, description: show.description, images: show.images,
    initials: show.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(), Icon: IconStarFilled };
}
