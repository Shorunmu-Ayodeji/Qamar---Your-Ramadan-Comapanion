import React, { useState, useEffect } from 'react';

const duasDatabase = {
  wealth: [
    {
      arabic: 'اللهم اجعل لي من مالي حلالا طيبا ينفعني',
      transliteration: "Allahumma ij'al li min mali halalan tayyiban yanfa'uni",
      english: 'O Allah, make my wealth lawful and pure that benefits me',
    },
    {
      arabic: 'اللهم ارزقني رزقا حلالا واسعا من حيث احتسب ومن حيث لا احتسب',
      transliteration: 'Allahumma arziqni rizqan halalan wasian min hayth ahtsib wa min hayth la ahtsib',
      english: 'O Allah, grant me abundant lawful sustenance from where I expect and from where I do not expect',
    },
    {
      arabic: 'اللهم بارك لي في رزقي واستجب دعائي',
      transliteration: 'Allahumma barik li fi rizqi wastajih du\'ai',
      english: 'O Allah, bless my sustenance and answer my supplication',
    },
  ],
  family: [
    {
      arabic: 'اللهم صلح بيننا وألف بين قلوبنا وأصدق نياتنا وأحسن نيات أهلينا',
      transliteration: 'Allahumma sallih baynana wa allif bayn quloobina wa asdiq niyatana wa ahsin niyat ahlinaa',
      english: 'O Allah, reconcile between us, unite our hearts, purify our intentions and improve the intentions of our families',
    },
    {
      arabic: 'اللهم احفظ أهلي وذريتي من كل شر وسوء',
      transliteration: 'Allahumma ihfaz ahli wa dhurriyyati min kulli sharrin wa suu',
      english: 'O Allah, protect my family and offspring from all evil and harm',
    },
    {
      arabic: 'اللهم اجعل أطفالي من أحسن الناس خلقا وأعظمهم حلما',
      transliteration: 'Allahumma ij\'al atfali min ahasan an-nasi khulqan wa a\'azamhum hulman',
      english: 'O Allah, make my children among the best in character and greatest in forbearance',
    },
  ],
  peace: [
    {
      arabic: 'اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
      transliteration: 'Allahumma atina fi ad-dunya hasanah wa fi al-akhirah hasanah wa qina adhaba an-nar',
      english: 'O Allah, grant us good in this life and good in the hereafter, and protect us from the punishment of the Fire',
    },
    {
      arabic: 'اللهم أصلح لي ديني الذي هو عصمة أمري',
      transliteration: 'Allahumma aslih li dini al-ladhi huwa ismat amri',
      english: 'O Allah, set right for me my religion which is the protection of my affairs',
    },
    {
      arabic: 'اللهم اجعل خير عمري اخره وخير أيامي يوم ألقاك فيه',
      transliteration: 'Allahumma ij\'al khayra umri akhirahu wa khayra ayyami yawm alqaka fih',
      english: 'O Allah, make the best of my life its end, and the best of my days the day I meet You',
    },
  ],
  discipline: [
    {
      arabic: 'اللهم اجعلني من التوابين واجعلني من المتطهرين',
      transliteration: 'Allahumma ij\'alni minat-tawwabin wa ij\'alni minal-mutatahhirin',
      english: 'O Allah, make me among those who repent and among those who purify themselves',
    },
    {
      arabic: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك',
      transliteration: 'Allahumma a\'ini ala dhikrika wa shukrika wa husni ibadatik',
      english: 'O Allah, help me to remember You, to be grateful to You, and to worship You excellently',
    },
    {
      arabic: 'اللهم اجعل قلبي خاشعا وبدني خاضعا ودمعي سابقا',
      transliteration: 'Allahumma ij\'al qalbi khashi\'an wa badani khadi\'an wa dam\'i sabiqan',
      english: 'O Allah, make my heart humble, my body submissive, and my tears flowing',
    },
  ],
  career: [
    {
      arabic: 'اللهم أصلح لي عملي وارزقني فيه خيرا',
      transliteration: 'Allahumma aslih li amali wa arziqni fih khayran',
      english: 'O Allah, set right my work and grant me good provisions from it',
    },
    {
      arabic: 'اللهم اجعل عملي خالصا لوجهك الكريم',
      transliteration: 'Allahumma ij\'al amali khalisn li wajhika al-karim',
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
      arabic: 'اللهم رزقني زوجة صالحة تعينني على طاعتك ومرضاتك',
      transliteration: 'Allahumma rziqni zawjah saliha ta\'inni ala ta\'atika wa mardat',
      english: 'O Allah, grant me a righteous spouse who helps me in Your obedience and pleasure',
    },
    {
      arabic: 'اللهم ألف بيننا بحب وودود وحسن معاشرة',
      transliteration: 'Allahumma allif baynana bi hubb wa wudud wa husn mu\'ashara',
      english: 'O Allah, unite us with love, affection, and good companionship',
    },
    {
      arabic: 'اللهم اجعل ذريتنا من الصالحين والصالحات',
      transliteration: 'Allahumma ij\'al dhurriyyatana mina as-salihin wa as-salihaat',
      english: 'O Allah, make our offspring among the righteous men and women',
    },
  ],
};

const DuaGenerator = ({ category, onDuaGenerate }) => {
  const [currentDua, setCurrentDua] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      generateNewDua();
    }
  }, [category]);

  const generateNewDua = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (category && duasDatabase[category]) {
        const duas = duasDatabase[category];
        const randomDua = duas[Math.floor(Math.random() * duas.length)];
        setCurrentDua(randomDua);
        onDuaGenerate?.(randomDua);
      }
      setIsLoading(false);
    }, 300);
  };

  if (!category) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">Select a category to generate du'a</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={generateNewDua}
        disabled={isLoading}
        aria-label="Generate new du'a"
        className="btn-primary w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          '✨ Generate New Du\'a'
        )}
      </button>

      {currentDua && (
        <div className="text-center text-gray-600">
          <p className="text-xs">Swipe or click button for new du\'a</p>
        </div>
      )}
    </div>
  );
};

export { DuaGenerator, duasDatabase };
