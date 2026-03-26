import React, { useState, useEffect } from 'react';

const duaData = {
  general: [
    {
      arabic: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة',
      transliteration: 'Allahumma inni as\'aluka al-afwa wal-afiyah fi ad-dunya wal-akhirah',
      english: 'O Allah, I ask You for forgiveness and well-being in this world and the Hereafter',
    },
    {
      arabic: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
      transliteration: 'Rabbana atina fi ad-dunya hasanah wa fil-akhirati hasanah waqina adhaban-nar',
      english: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire',
    },
  ],
  career: [
    {
      arabic: 'اللهم أصلح لي عملي وارزقني فيه خيرا',
      transliteration: 'Allahumma aslih li amali wa urzuqni fih khayran',
      english: 'O Allah, set right my work and grant me good provisions from it',
    },
    {
      arabic: 'اللهم اجعل عملي خالصا لوجهك الكريم',
      transliteration: 'Allahumma ij\'al amali khalisan li wajhika al-karim',
      english: 'O Allah, make my work purely for Your noble Face',
    },
    {
      arabic: 'اللهم يسر لي عملي وبارك فيه وأصلح نيتي فيه',
      transliteration: 'Allahumma yassir li amali wa barik fih wa aslih niyyati fih',
      english: 'O Allah, ease my work, bless it, and correct my intention in it',
    },
  ],
  marriage: [
    {
      arabic: 'اللهم ارزقني زوجة صالحة تعينني على طاعتك ومرضاتك',
      transliteration: 'Allahumma urzuqni zawjah saliha ta\'inni ala ta\'atika wa mardatik',
      english: 'O Allah, grant me a righteous spouse who helps me in Your obedience and pleasure',
    },
    {
      arabic: 'اللهم ألف بيننا بحب وودود وحسن معاشرة',
      transliteration: 'Allahumma allif baynana bi hubb wa wudud wa husn mu\'ashara',
      english: 'O Allah, unite us with love, affection, and good companionship',
    },
    {
      arabic: 'ربنا هب لنا من أزواجنا وذرياتنا قرة أعين واجعلنا للمتقين إماما',
      transliteration: 'Rabbana hab lana min azwajina wa dhurriyatina qurrata a\'yunin waj\'alna lil-muttaqina imama',
      english: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous',
    },
  ],
};

export const DuaGenerator = () => {
  const [category, setCategory] = useState('general');
  const [dua, setDua] = useState(null);

  const generateDua = () => {
    const duas = duaData[category];
    const randomIndex = Math.floor(Math.random() * duas.length);
    setDua(duas[randomIndex]);
  };

  useEffect(() => {
    generateDua();
  }, [category]);

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dua Generator</h2>
      
      <div className="flex space-x-2 mb-4">
        {Object.keys(duaData).map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              category === cat 
                ? 'bg-ramadan-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {dua && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-lg text-right font-arabic text-gray-800 dark:text-gray-200" dir="rtl">{dua.arabic}</p>
          <p className="text-sm italic text-gray-600 dark:text-gray-400">{dua.transliteration}</p>
          <p className="text-md text-gray-700 dark:text-gray-300">{dua.english}</p>
        </div>
      )}

      <button onClick={generateDua} className="btn-primary w-full mt-4">
        Generate New Dua
      </button>
    </div>
  );
};

export default DuaGenerator;