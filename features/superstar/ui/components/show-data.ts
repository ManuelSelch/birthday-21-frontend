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
export const performers = [
  {name:'Joschua',act:'Kartenzauber',initials:'JO', Icon:IconCards},
  {name:'Danny',act:'Jonglieren',initials:'DA', Icon:IconSparkles},
  {name:'Johannes',act:'Klavier',initials:'JO', Icon:IconStarFilled},
  {name:'Jakob',act:'Zeichentalent',initials:'JA', Icon:IconStarFilled},
  {name:'Charlie',act:'Karaoke? / noch offen',initials:'CH', Icon:IconMicrophone},
  {name:'Daniel, Thiebaud & Leonard',act:'Überraschung / noch offen',initials:'DTL', Icon:IconSparkles}
];
