import type { RayTracingTranslation } from "./en";

// French. Text only: everything else comes from the English (see en.ts).
export const RAY_TRACING_FR: RayTracingTranslation = {
  lessons: [
    {
      title: "La gravité est la forme de l'espace-temps",
      lead: "Les objets tombent parce que l'espace et le temps sont courbés.",
      paragraphs: [
        "Newton décrivait la gravité comme une force qui attire les masses les unes vers les autres. En 1915, Einstein a remplacé cette force par de la géométrie. La masse et l'énergie courbent l'espace-temps, ce tissu à quatre dimensions fait d'espace et de temps, et tout ce qui existe, des planètes à la lumière, y suit le chemin le plus droit possible. Si la Terre tourne autour du Soleil, ce n'est pas parce que quelque chose la tire : dans l'espace-temps courbé autour du Soleil, son chemin le plus droit se referme en une orbite.",
        "Le temps fait lui aussi partie du tissu : plus une horloge est proche d'une masse, plus elle bat lentement. L'effet est minuscule, mais bien réel. Les horloges des satellites GPS, plus éloignées de la masse de la Terre, prennent environ 45 microsecondes d'avance par jour sur celles restées au sol ; leur vitesse orbitale leur en reprend 7. Si l'on ignorait cet écart, les positions calculées dériveraient d'une dizaine de kilomètres par jour.",
      ],
      keyIdea: {
        text: "L'espace-temps dit à la matière comment se mouvoir ; la matière dit à l'espace-temps comment se courber. (John Wheeler)",
      },
      facts: [
        {
          value: "1915",
          label: "Einstein publie la relativité générale",
        },
        {
          value: "38 µs",
          label: "d'avance nette par jour pour une horloge GPS",
        },
      ],
      caption: "L'image de la toile élastique : une masse creuse la grille et une lune roule autour du creux. Ce n'est qu'une analogie, car la vraie courbure touche aussi le temps, mais elle rend bien l'idée.",
      tryIt: {
        label: "Voir la courbure sur une grille",
      },
    },
    {
      title: "Trop lourd pour la lumière",
      lead: "Comprimez une masse dans un volume assez petit, et plus rien ne peut en sortir.",
      paragraphs: [
        "Lancez une balle vers le haut : elle retombe. Lancez-la à plus de 11,2 kilomètres par seconde, la vitesse de libération de la Terre, et elle ne reviendra jamais. La vitesse de libération dépend de la masse et de la distance qui vous en sépare : comprimez la Terre sans changer sa masse, et la vitesse de libération à sa surface augmente.",
        "En 1783, l'ecclésiastique anglais John Michell s'est demandé ce qui se passerait si une étoile était si compacte que sa vitesse de libération dépassait celle de la lumière. Sa lumière ne pourrait jamais s'en échapper : ce serait une étoile noire. La théorie d'Einstein rend l'idée exacte. En 1916, Karl Schwarzschild a trouvé la solution pour une masse isolée, et elle recèle une taille critique, appelée aujourd'hui rayon de Schwarzschild. Comprimez n'importe quelle masse en deçà, et un trou noir se forme.",
      ],
      keyIdea: {
        text: "Toute masse a un rayon de Schwarzschild. Il vaut environ 3 kilomètres pour chaque masse solaire.",
      },
      caption: "Choisissez un objet. Les objets ordinaires sont réduits à leur rayon de Schwarzschild ; les vrais trous noirs sont comparés à des orbites de notre Système solaire.",
    },
    {
      title: "Comment naît un trou noir",
      lead: "Quand une étoile géante épuise son combustible, la gravité l'emporte.",
      paragraphs: [
        "Une étoile est un numéro d'équilibriste. La gravité attire son gaz vers l'intérieur, et la chaleur de la fusion nucléaire, en son cœur, le repousse. Quand le combustible s'épuise, l'équilibre se rompt. Les étoiles comme le Soleil se contractent en naines blanches, soutenues par des électrons qui refusent d'être comprimés davantage.",
        "Les étoiles de plus de huit masses solaires environ finissent en supernova : leur cœur de fer s'effondre en moins d'une seconde. Le plus souvent, ce cœur devient une étoile à neutrons. Mais si ce qui reste pèse plus de deux à trois masses solaires environ, comme c'est souvent le cas pour les étoiles d'une vingtaine de masses solaires ou plus, même les neutrons ne peuvent plus le soutenir, et il passe sous son propre rayon de Schwarzschild. Un trou noir stellaire est né, en général de 5 à 50 fois plus massif que le Soleil.",
        "Chaque grande galaxie abrite aussi en son centre un trou noir supermassif, des millions à des milliards de fois plus lourd. Le nôtre, Sagittarius A*, pèse environ 4,3 millions de masses solaires : les astronomes l'ont pesé en suivant, depuis plus de trente ans, les étoiles qui tournent autour de lui. Comment de tels géants ont pu devenir si massifs, si tôt dans l'histoire de l'Univers, reste une question ouverte.",
      ],
      keyIdea: {
        text: "Les trous noirs forment deux grandes familles : les trous noirs stellaires, laissés par des étoiles mourantes, et les trous noirs supermassifs, au centre des galaxies.",
      },
      facts: [
        {
          value: "~100 millions",
          label: "de trous noirs stellaires estimés dans la Voie lactée",
        },
        {
          value: "4,3 millions",
          label: "de masses solaires pour Sagittarius A*, au cœur de notre galaxie",
        },
      ],
      caption: "Une étoile massive, l'effondrement de son cœur, la supernova et le trou noir qui en reste. Les durées sont extrêmement raccourcies : l'étoile vit des millions d'années, l'effondrement dure une fraction de seconde.",
    },
    {
      title: "L'horizon des événements",
      lead: "Une frontière qu'on ne franchit qu'une seule fois.",
      paragraphs: [
        "Le rayon de Schwarzschild marque l'horizon des événements. Ce n'est pas une surface : un astronaute qui le traverserait n'y trouverait rien. C'est un point de non-retour. À l'extérieur, une fusée assez puissante peut encore s'échapper. À l'intérieur, tous les chemins possibles, même ceux de la lumière, s'enfoncent toujours plus loin.",
        "On peut se le représenter comme une rivière. L'espace s'écoule vers le trou noir comme l'eau vers une cascade, de plus en plus vite, et la lumière y nage à la vitesse de la lumière. Loin du trou, le courant est faible et la lumière s'éloigne sans peine. À l'horizon, le courant atteint la vitesse de la lumière, et la lumière dirigée vers l'extérieur fait du surplace. À l'intérieur, le courant l'emporte toujours.",
        "Le temps raconte la même histoire. Vue de loin, une horloge qui tombe bat de plus en plus lentement à l'approche de l'horizon, et sa lumière devient toujours plus rouge et plus faible, jusqu'à disparaître, comme figée au bord. L'astronaute qui la tient ne remarque rien de tout cela et franchit l'horizon en un temps fini.",
      ],
      keyIdea: {
        text: "Près d'une masse, les horloges ralentissent d'un facteur qui tombe à zéro à l'horizon.",
      },
      caption: "Le modèle de la rivière. Les points figurent l'espace qui s'écoule vers l'intérieur ; les flèches, des éclairs de lumière dirigés vers l'extérieur. Hors de l'horizon, la lumière progresse lentement ; à l'horizon, elle fait du surplace ; à l'intérieur, elle est emportée.",
      tryIt: {
        label: "Franchir soi-même l'horizon",
      },
    },
    {
      title: "La sphère de photons et l'ombre",
      lead: "La lumière peut tourner autour d'un trou noir, et cela creuse un trou dans le ciel.",
      paragraphs: [
        "À une fois et demie le rayon de Schwarzschild, la gravité courbe la lumière en cercle. C'est la sphère de photons. Cette orbite est instable, comme un crayon en équilibre sur sa pointe : la moindre poussée fait plonger la lumière en spirale ou l'envoie au loin. Si vous pouviez vous y tenir, vous verriez l'arrière de votre propre tête.",
        "La lumière qui arrive de loin en visant à moins d'une certaine distance critique du centre passe sous la sphère de photons et est engloutie. Vus de l'extérieur, tous ces rayons manquants forment un disque sombre : l'ombre du trou noir. La gravité l'agrandit, si bien qu'elle est environ 2,6 fois plus large que l'horizon lui-même. La lumière qui le manque de peu fait le tour du trou au passage et s'accumule en un fin anneau brillant au bord de l'ombre.",
        "En 2019, l'Event Horizon Telescope, un réseau de radiotélescopes aussi vaste que la Terre, a photographié l'ombre du trou noir M87*, à 55 millions d'années-lumière. En 2022, il a fait de même pour Sagittarius A* : vu de la Terre, son anneau paraît aussi grand qu'un donut posé sur la Lune.",
      ],
      keyIdea: {
        text: "La sphère de photons se situe à 1,5 r_s. L'ombre qu'elle dessine sur le ciel a un rayon d'environ 2,6 r_s.",
      },
      caption: "Des rayons lumineux venus de la gauche, calculés à partir des équations de Schwarzschild. Les rayons qui visent en deçà de la distance critique (en pointillés) sont capturés ; celui qui la manque de peu fait d'abord le tour du trou.",
      tryIt: {
        label: "Voir l'ombre sans le disque",
      },
    },
    {
      title: "Le disque d'accrétion",
      lead: "Les trous noirs sont invisibles. Le gaz qui y tombe compte parmi les objets les plus lumineux de l'Univers.",
      paragraphs: [
        "À lui seul, un trou noir n'émet aucune lumière. Ce que l'on voit, c'est la matière en train d'y tomber. Le gaz venu d'une étoile compagne ou du centre encombré d'une galaxie ne peut pas y tomber tout droit : comme l'eau qui tourbillonne au-dessus d'une bonde, il garde son mouvement latéral et s'organise en un disque plat qui tourne.",
        "Le disque intérieur tourne bien plus vite que le disque extérieur, si bien que les anneaux de gaz voisins glissent les uns contre les autres. Des champs magnétiques enchevêtrés agissent comme un frottement : ils chauffent le gaz à des millions de degrés et le laissent descendre lentement en spirale. Au bord intérieur, il file à la moitié de la vitesse de la lumière.",
        "Ce bord intérieur est la dernière orbite circulaire stable, ou ISCO : trois fois le rayon de Schwarzschild pour un trou noir qui ne tourne pas. Plus près, aucune orbite n'est stable, et le gaz plonge dans l'horizon. Avant d'y arriver, il a converti environ 6 % de sa masse en lumière, et jusqu'à 30 % environ autour d'un trou noir en rotation rapide. La fusion nucléaire n'atteint que 0,7 %. Voilà pourquoi les quasars, alimentés par des trous noirs supermassifs, éclipsent leur galaxie tout entière.",
      ],
      keyIdea: {
        text: "Les orbites intérieures sont plus rapides que les extérieures, tout comme Mercure va plus vite que Neptune. Le frottement entre elles chauffe le gaz et lui soutire son énergie.",
      },
      facts: [
        {
          value: "6 à 30 %",
          label: "de la masse du gaz convertie en lumière",
        },
        {
          value: "0,7 %",
          label: "pour la fusion nucléaire au cœur du Soleil",
        },
      ],
      caption: "Le disque vu de dessus. Chaque anneau tourne à sa propre vitesse, d'autant plus vite qu'il est proche du centre. En deçà de l'ISCO (en pointillés), le gaz tombe en spirale dans le trou.",
      tryIt: {
        label: "Accélérer le disque",
      },
    },
    {
      title: "Pourquoi le disque passe par-dessus",
      lead: "La silhouette célèbre du trou noir d'Interstellar vient de la gravité, qui agit comme une lentille.",
      paragraphs: [
        "Sans gravité, un disque entourant une boule, vu de profil, ressemblerait à une ellipse aplatie dont la moitié arrière serait cachée par la boule. Un trou noir courbe la lumière de cette moitié arrière sur son chemin vers nous. La lumière qui quitte le dessus du disque arrière est déviée vers le haut, par-dessus l'ombre ; celle de sa face inférieure passe en dessous. On voit donc l'arrière du disque deux fois : en une arche au-dessus, et en une arche plus fine en dessous.",
        "Le disque lui-même n'est pas courbé du tout : il est plat et mince. Seule la lumière l'est. Changez de point de vue, et l'image change avec lui : vue d'en haut, la partie arrière du disque s'enroule en un anneau tout autour de l'ombre.",
      ],
      keyIdea: {
        text: "Un trou noir est une lentille : il vous montre ce qui se trouve derrière lui, étiré, agrandi et souvent plus d'une fois.",
      },
      caption: "Le même disque plat, sans puis avec la déviation de la lumière. Appuyez sur les boutons pour passer de l'un à l'autre.",
      tryIt: {
        label: "Regarder de très haut",
      },
    },
    {
      title: "Un côté brille davantage",
      lead: "Le gaz lancé à toute allure projette sa lumière vers l'avant, et la gravité lui soutire son énergie.",
      paragraphs: [
        "Près de son bord intérieur, le disque se déplace à une bonne fraction de la vitesse de la lumière : d'un côté vers nous, de l'autre en s'éloignant. La relativité donne à cela une importance énorme. La lumière du côté qui s'approche est décalée vers le bleu et concentrée en un faisceau dirigé vers l'avant : elle paraît bien plus brillante ; le côté qui s'éloigne paraît plus rouge et plus sombre. La luminosité varie à peu près comme la puissance quatre du facteur Doppler : un petit changement de couleur entraîne donc un grand changement de luminosité.",
        "En plus de cela, la lumière qui s'arrache à la gravité du trou noir perd de l'énergie et se décale vers le rouge : c'est le décalage vers le rouge gravitationnel. Le gaz le plus proche du centre, le plus chaud de tous, paraît plus froid et plus sombre qu'il ne l'est réellement.",
        "Interstellar a laissé tout cela de côté. Ses créateurs ont gardé un disque symétrique pour ne pas dérouter le public avec un trou noir bancal. La simulation permet les deux : son mode cinéma garde une teinte unique, tandis que son mode physique décale chaque partie du disque selon sa propre température de corps noir.",
      ],
      keyIdea: {
        text: "Ce que l'on voit dépend de la vitesse de la source et de sa profondeur dans le champ de gravité. Les deux se combinent en un seul facteur de décalage g.",
      },
      caption: "Couleurs réelles pour un spin de 0,95 : à gauche, le gaz vient vers nous et vire au blanc bleuté ; à droite, il s'éloigne et pâlit vers l'orange.",
      tryIt: {
        label: "Activer les couleurs réelles",
      },
    },
    {
      title: "La rotation",
      lead: "Les vrais trous noirs tournent, et entraînent l'espace-temps avec eux.",
      paragraphs: [
        "Les étoiles tournent sur elles-mêmes, et un cœur qui s'effondre tourne de plus en plus vite, comme un patineur qui ramène les bras contre lui. Le trou noir conserve cette rotation. En 1963, Roy Kerr a trouvé la solution exacte d'un trou noir en rotation. Le trou noir d'Interstellar, comme celui de ces simulations, est précisément un trou noir en rotation de ce type.",
        "Un trou noir en rotation entraîne l'espace avec lui : c'est l'entraînement des référentiels. Tout près, cet entraînement est si fort que rien ne peut rester immobile : dans l'ergosphère, même une fusée à pleine poussée est emportée dans le sens de la rotation. L'horizon rétrécit, et le gaz qui orbite dans le même sens que la rotation peut s'approcher bien plus près avant de plonger : le disque s'avance plus près du trou et chauffe davantage.",
        "La rotation modifie aussi l'ombre. La lumière qui passe du côté qui tourne vers nous est portée par le mouvement et peut s'approcher davantage, tandis que celle de l'autre côté est freinée. À rotation élevée, un bord de l'ombre s'aplatit et toute l'ombre se décale sur le côté.",
      ],
      keyIdea: {
        text: "Le spin se mesure par a/M, de 0 (aucune rotation) à 1 (la rotation la plus rapide possible). Selon la théorie, les trous noirs réels plafonnent vers 0,998.",
      },
      caption: "Coupe d'un trou noir en rotation, vu de profil. Déplacez le curseur : l'horizon rétrécit, l'ergosphère se renfle à l'équateur, et un disque qui tourne dans le sens de la rotation s'avance plus près, tandis qu'un disque qui tourne en sens inverse est tenu plus à l'écart.",
    },
    {
      title: "La spaghettification",
      lead: "Tombez les pieds en avant, et la gravité tirera plus fort sur vos pieds que sur votre tête.",
      paragraphs: [
        "La gravité s'affaiblit avec la distance : elle tire donc toujours un peu plus fort sur l'extrémité proche d'un objet que sur son extrémité éloignée. Sur Terre, à l'échelle de votre corps, la différence est bien trop faible pour être perçue ; à l'échelle de la Terre, celle due à la Lune soulève les marées océaniques. Près d'un trou noir, elle devient énorme : un astronaute qui tombe est étiré de la tête aux pieds et comprimé sur les côtés, comme un spaghetti.",
        "Étonnamment, ce sont les petits trous noirs qui sont dangereux. Si vous tombiez dans un trou noir de 10 masses solaires, la différence d'attraction entre vos pieds et votre tête atteindrait vingt millions de g à l'horizon : vous seriez mis en pièces des centaines de kilomètres avant de l'atteindre. Pour Sagittarius A*, cette différence à l'horizon est d'environ un dix-millième de g. Vous le franchiriez sans rien sentir.",
        "Les étoiles connaissent le même sort. Quand l'une d'elles s'aventure trop près d'un trou noir supermassif, elle est étirée en un long courant de gaz, dont une partie tombe dans le trou en allumant un sursaut de lumière qui dure des mois : un événement de rupture par effet de marée.",
      ],
      keyIdea: {
        text: "L'étirement croît comme l'inverse du cube de la distance. À l'horizon, il décroît comme le carré de la masse.",
      },
      facts: [
        {
          value: "20 000 000 g",
          label: "à l'horizon d'un trou noir de 10 masses solaires",
        },
        {
          value: "0,0001 g",
          label: "à l'horizon de Sagittarius A*",
        },
      ],
      caption: "Un astronaute qui tombe vers un petit trou noir est étiré dans le sens de la chute et comprimé dans le sens transversal.",
      tryIt: {
        label: "Tomber dans un trou noir de 10 masses solaires",
      },
    },
    {
      title: "Les trous noirs sont-ils éternels ?",
      lead: "Presque. La mécanique quantique leur permet de briller, très faiblement.",
      paragraphs: [
        "En 1974, Stephen Hawking a montré que des effets quantiques près de l'horizon donnent au trou noir une faible lueur thermique : il perd lentement de la masse. Plus un trou noir est gros, plus il est froid. Un trou noir de la masse du Soleil aurait une température d'environ 60 milliardièmes de degré au-dessus du zéro absolu, bien moins que les 2,7 K du rayonnement fossile du Big Bang. Aujourd'hui, tous les trous noirs connus absorbent donc plus d'énergie qu'ils n'en rayonnent, et grossissent.",
        "Ce n'est que dans un futur très lointain, une fois l'Univers devenu plus froid qu'eux, qu'ils commenceront à rétrécir. Un trou noir d'une masse solaire mettrait environ 10⁶⁷ ans à s'évaporer ; les plus gros, environ 10¹⁰⁰ ans. Le rayonnement de Hawking n'a jamais été observé, mais il reste l'un de nos indices les plus précieux sur la manière dont la gravité et la mécanique quantique s'accordent.",
      ],
      keyIdea: {
        text: "La température d'un trou noir est inversement proportionnelle à sa masse : plus il est petit, plus il est chaud.",
      },
      facts: [
        {
          value: "60 nK",
          label: "température d'un trou noir d'une masse solaire",
        },
        {
          value: "2,7 K",
          label: "température du fond diffus cosmologique",
        },
        {
          value: "10⁶⁷ ans",
          label: "pour qu'un trou noir d'une masse solaire s'évapore",
        },
      ],
      caption: "Des paires de particules apparaissent à l'horizon ; l'une d'elles s'échappe sous forme de rayonnement de Hawking. C'est l'image populaire, une simplification du calcul réel.",
    },
  ],
  chapters: [
    {
      field: "Relativité générale",
      title: "Le trou noir",
      subtitle: "La masse d'une étoile, repliée si étroitement que même la lumière ne s'en échappe pas.",
      imageCaption: "Un trou noir de spin 0,215, vu juste au-dessus de son disque d'accrétion.",
      paragraphs: [
        "Gargantua, le trou noir d'Interstellar, est un trou noir en rotation. La masse courbe l'espace-temps, et la lumière, qui suit toujours le chemin le plus droit possible, épouse cette courbure. Près du trou, la déviation est si forte que la lumière peut tourner autour, faire une boucle derrière lui ou y tomber pour de bon.",
        "Chaque pixel est ici un rayon de lumière suivi à rebours depuis la caméra, à travers l'espace-temps courbé autour du trou. Si le rayon franchit l'horizon des événements, le pixel est noir : c'est l'ombre. S'il traverse le fin disque de gaz chaud qui tourne autour du trou, il en capte l'éclat, modifié en couleur et en luminosité par la vitesse du gaz et par la gravité elle-même.",
      ],
      features: [
        {
          title: "L'ombre",
          text: "L'ensemble des directions d'où aucune lumière ne peut vous parvenir. Elle est environ deux fois et demie plus large que l'horizon des événements, car la lumière qui passe près du trou est elle aussi capturée.",
        },
        {
          title: "L'arche du dessus",
          text: "La partie du disque située derrière le trou. Sa lumière est déviée vers le haut, par-dessus l'ombre, si bien que le disque semble s'enrouler autour.",
        },
        {
          title: "L'anneau fin",
          text: "Une lumière qui a frôlé la sphère de photons et fait le tour du trou avant de s'échapper. Chaque tour de plus donne une image plus fine et plus pâle.",
        },
        {
          title: "Un côté plus brillant",
          text: "D'un côté, le gaz fonce vers vous à une fraction notable de la vitesse de la lumière. La focalisation relativiste projette sa lumière vers l'avant : le côté qui s'approche éclipse celui qui s'éloigne.",
        },
      ],
      equations: [
        {
          name: "La lumière suit des géodésiques nulles",
          note: "L'intervalle d'espace-temps le long d'un rayon lumineux est nul ; la métrique g décrit la courbure.",
        },
        {
          name: "Horizon des événements",
          note: "a est le moment cinétique par unité de masse. Pour a = M, le trou tourne aussi vite que possible.",
        },
        {
          name: "Luminosité du disque",
          note: "Iν/ν³ se conserve le long d'un rayon : le décalage g fixe donc à la fois la couleur et la luminosité.",
        },
      ],
      presets: [
        {
          label: "Sans rotation",
          description: "Un trou noir de Schwarzschild : l'ombre devient un cercle parfait.",
        },
        {
          label: "Rotation quasi maximale",
          description: "L'entraînement des référentiels emporte la lumière et aplatit un côté de l'ombre.",
        },
        {
          label: "Couleurs réelles",
          description: "Effet Doppler complet : le côté qui s'approche vire au blanc bleuté, celui qui s'éloigne au rouge.",
        },
        {
          label: "Le choix d'Interstellar",
          description: "Coupez l'effet Doppler, comme le film l'a fait, et le disque devient symétrique.",
        },
        {
          label: "Grille de déviation",
          description: "Remplacez les étoiles par une grille pour voir à quel point le trou dévie la lumière.",
        },
        {
          label: "Juste l'ombre",
          description: "Masquez le disque pour voir l'ombre et, derrière elle, les étoiles déformées par l'effet de lentille.",
        },
      ],
    },
    {
      field: "Relativité générale",
      title: "Plongée dans le trou noir",
      subtitle: "Ce que vous verriez vraiment lors d'un aller simple à travers l'horizon des événements.",
      imageCaption: "Juste après l'horizon. La région noire en dessous n'occupe encore qu'une partie du ciel, cerclée de lumière décalée vers le bleu.",
      paragraphs: [
        "Que verriez-vous en tombant dans un trou noir ? Autour d'un trou noir, l'espace s'écoule vers l'intérieur comme une rivière, d'autant plus vite qu'il s'en approche, et à l'horizon il s'écoule à la vitesse de la lumière. Lâché de très loin, vous êtes emporté par ce courant, si bien que vous franchissez l'horizon sans rien sentir. Rien ne marque la frontière. Ce n'est qu'ensuite que tous les chemins mènent à la singularité.",
        "Ici, la caméra tombe tout droit dans un trou noir sans rotation. Comme le trou est parfaitement rond, le trajet d'un rayon lumineux ne dépend que de votre distance et de l'angle sous lequel vous regardez : chaque rayon possible est donc calculé une seule fois et rangé dans une table. Votre chute modifie aussi les couleurs que vous voyez : la lumière venue d'en dessous est décalée vers le bleu et celle venue d'en haut vers le rouge, d'une quantité qui combine la gravité et votre propre vitesse.",
      ],
      features: [
        {
          title: "La région noire en dessous",
          text: "L'ensemble des directions d'où aucune lumière ne peut vous parvenir. Elle s'agrandit pendant la chute, et pourtant, quand vous franchissez l'horizon, elle ne couvre qu'un cercle d'environ 84° de diamètre. L'horizon semble toujours se trouver plus loin devant vous.",
        },
        {
          title: "L'anneau à son bord",
          text: "Une lumière qui a frôlé la sphère de photons, à une fois et demie le rayon de l'horizon. Vous tombez vers elle : elle est donc décalée vers le bleu, en une lueur d'un blanc bleuté.",
        },
        {
          title: "À l'intérieur",
          text: "La singularité n'est plus un lieu sous vos pieds, mais un moment de votre avenir. Lâché de très loin, vous l'atteignez 4GM/3c³ après avoir franchi l'horizon, selon votre propre montre : environ 28 secondes pour Sagittarius A*.",
        },
        {
          title: "La dernière vue",
          text: "Près de la singularité, le ciel au-dessus de vous s'assombrit en un rouge profond, tandis que la lumière venue des côtés se resserre autour de vous en une fine bande d'un bleu intense.",
        },
        {
          title: "En vol stationnaire",
          text: "Quelqu'un qui se maintient juste au-dessus de l'horizon grâce à une fusée puissante voit tout autre chose : tout l'Univers extérieur comprimé en un petit cercle au-dessus de sa tête, éclatant et décalé vers le bleu.",
        },
      ],
      equations: [
        {
          name: "La rivière d'espace",
          note: "La vitesse à laquelle l'espace s'écoule vers l'intérieur, qui est aussi celle de tout objet lâché de très loin. Elle atteint c à l'horizon, r = 2GM/c², et la dépasse à l'intérieur.",
        },
        {
          name: "La couleur du ciel",
          note: "α est mesuré depuis le zénith. Ce facteur combine exactement la gravité et votre propre chute : bleu en dessous, rouge au-dessus.",
        },
        {
          name: "Le temps qui reste",
          note: "Votre temps propre jusqu'à la singularité. Depuis l'horizon : 4GM/3c³, soit environ 28 s pour Sagittarius A* et 12 heures pour M87*.",
        },
      ],
      presets: [
        {
          label: "Immobile au bord",
          description: "Allumez les fusées pour rester immobile juste au-dessus de l'horizon : le ciel se réduit à un cercle brillant au-dessus de vous.",
        },
        {
          label: "Halte à la sphère de photons",
          description: "Arrêtez-vous là où la lumière pourrait tourner autour du trou, puis faites glisser pour regarder autour de vous.",
        },
        {
          label: "Juste après l'horizon",
          description: "Passé le point de non-retour, l'horizon semble pourtant toujours sous vos pieds.",
        },
        {
          label: "L'autre univers",
          description: "Dans un trou noir idéalisé et éternel, un second univers apparaît sous vos pieds.",
        },
        {
          label: "Chute en temps réel",
          description: "Tombez au rythme réel de votre propre horloge : l'intérieur ne dure qu'un clin d'œil.",
        },
        {
          label: "Grille de déviation",
          description: "Remplacez les étoiles par une grille pour voir comment la vue est courbée et comprimée.",
        },
      ],
    },
    {
      field: "Relativité générale",
      title: "Le trou de ver",
      subtitle: "Un tunnel à travers l'espace-temps, comme une boule de cristal ouverte sur une autre galaxie.",
      imageCaption: "À l'approche de l'embouchure : la galaxie lointaine à l'intérieur, notre propre ciel enroulé en anneaux tout autour.",
      paragraphs: [
        "Un trou de ver relie deux régions éloignées de l'espace par un raccourci. Celui d'Interstellar, conçu avec le physicien Kip Thorne, est un tunnel lisse à symétrie sphérique, décrit par trois nombres : le rayon de sa gorge ρ, la longueur de la gorge 2a et une largeur de lentille fixée par M.",
        "Vu de l'extérieur, il ressemble à une sphère. La lumière qui traverse le tunnel apporte la vue de l'autre côté : une autre galaxie apparaît donc à l'intérieur, tandis que la lumière qui frôle l'embouchure dessine des anneaux du ciel situé derrière vous. Comme la forme est très symétrique, le sort d'un rayon lumineux ne dépend que de deux nombres : chaque rayon possible est donc intégré une seule fois dans une table, et la caméra peut traverser le trou de ver de part en part.",
      ],
      features: [
        {
          title: "La sphère",
          text: "L'embouchure du trou de ver. À l'intérieur, vous voyez le ciel de l'autre côté, déformé par la gorge comme par une lentille.",
        },
        {
          title: "Les anneaux autour",
          text: "La lumière de votre propre ciel, courbée autour de l'embouchure. Plus on s'approche du bord, plus elle a fait de tours.",
        },
        {
          title: "Dans la gorge",
          text: "Les parois montrent les deux ciels, étirés le long du tunnel. La caméra se tourne vers elles pendant la traversée.",
        },
        {
          title: "Regard en arrière",
          text: "De l'autre côté, c'est votre galaxie d'origine qui apparaît dans la sphère.",
        },
      ],
      equations: [
        {
          name: "La géométrie",
          note: "ℓ est la distance parcourue dans le tunnel ; r(ℓ) est la taille de la sphère en ce point.",
        },
        {
          name: "La forme",
          note: "avec x = 2(|ℓ| − a) / πM hors de la gorge, et r = ρ à l'intérieur.",
        },
        {
          name: "Quels rayons passent",
          note: "Le paramètre d'impact b se conserve le long d'un rayon ; seuls les rayons dont b est inférieur au rayon de la gorge la traversent.",
        },
      ],
      presets: [
        {
          label: "Traversée",
          description: "Un aller simple à travers la gorge, en boucle.",
        },
        {
          label: "Lentille forte",
          description: "Une embouchure plus large et plus douce, qui courbe une bien plus grande part du ciel.",
        },
        {
          label: "Gorge longue",
          description: "Un tunnel plus long : à l'intérieur, les parois s'étirent en traînées.",
        },
        {
          label: "Bord net",
          description: "Pas de tunnel et presque aucune largeur de lentille : une sphère nette aux anneaux fins.",
        },
        {
          label: "Grille de déviation",
          description: "Remplacez le ciel d'origine par une grille pour voir comment il s'enroule autour de l'embouchure.",
        },
        {
          label: "Halte à l'embouchure",
          description: "Arrêtez-vous juste devant l'embouchure, puis faites glisser pour regarder autour de vous.",
        },
      ],
    },
    {
      field: "Relativité restreinte",
      title: "Près de la vitesse de la lumière",
      subtitle: "Filez vers le centre de la Voie lactée et regardez le ciel se resserrer devant vous.",
      imageCaption: "À 0,99c, toute la galaxie est comprimée vers l'avant en une bande étroite, décalée vers le bleu.",
      paragraphs: [
        "Rien de ce qui a une masse ne peut atteindre la vitesse de la lumière, mais on peut s'en approcher autant qu'on veut. Le ciel change alors de trois façons à la fois. L'aberration resserre la vue vers l'avant, comme la pluie qui semble tomber en biais vers vous quand vous courez. L'effet Doppler décale la lumière de devant vers le bleu et celle de derrière vers le rouge. Et la focalisation rend la vue de devant plus brillante et celle de derrière plus sombre.",
        "Ici, la vitesse est réglée par la rapidité η, votre vitesse valant v = c·tanh η. Les rapidités s'additionnent simplement : des pas égaux du curseur correspondent à des poussées égales du moteur, même quand v se rapproche toujours plus de c. Le temps du vaisseau et celui de la galaxie sont comptés séparément : à grande vitesse, des années s'écoulent chez vous pour chaque seconde à bord.",
      ],
      features: [
        {
          title: "Le cône brillant devant",
          text: "La lumière des étoiles venue de toutes parts se resserre vers l'avant. À 0,99c, tout ce qui se trouvait devant vous tient dans un cercle de 16° de diamètre seulement.",
        },
        {
          title: "Décalage des couleurs",
          text: "Les étoiles de devant sont décalées vers le bleu et celles de derrière vers le rouge, selon le facteur Doppler D.",
        },
        {
          title: "L'obscurité derrière",
          text: "La focalisation assombrit tellement la vue derrière vous qu'à grande vitesse, le ciel y disparaît presque.",
        },
        {
          title: "Étoiles qui défilent",
          text: "Un champ 3D d'étoiles proches défile avec une vraie parallaxe, étiré par la même aberration.",
        },
      ],
      equations: [
        {
          name: "La vitesse à partir de la rapidité",
          note: "Les rapidités s'additionnent comme des nombres ordinaires ; les vitesses, non.",
        },
        {
          name: "Aberration",
          note: "Les angles mesurés depuis la direction du mouvement rétrécissent quand η augmente.",
        },
        {
          name: "Facteur Doppler",
          note: "Une étoile à la température T ressemble exactement à une étoile à D·T : un corps noir reste un corps noir.",
        },
      ],
      presets: [
        {
          label: "Au repos",
          description: "La Voie lactée ordinaire, pour comparer.",
        },
        {
          label: "0,9c",
          description: "Le ciel commence à se resserrer vers l'avant et à bleuir devant vous.",
        },
        {
          label: "0,99c",
          description: "La moitié du ciel tient dans un cône étroit devant vous.",
        },
        {
          label: "0,99999c",
          description: "La galaxie se réduit à un point devant vous, et le fond diffus cosmologique se met à briller.",
        },
        {
          label: "Géométrie seule",
          description: "Désactivez les changements de couleur et de luminosité pour voir l'aberration pure.",
        },
        {
          label: "Accélérer à 1 g",
          description: "Partez du repos sous une gravité terrestre : après un an de temps de bord, vous atteignez 0,77c.",
        },
      ],
    },
  ],
  glossary: [
    {
      title: "Rayon de Schwarzschild",
      text: "La taille à laquelle une masse doit être comprimée pour devenir un trou noir : rₛ = 2GM/c², soit environ 3 km par masse solaire.",
    },
    {
      title: "Horizon des événements",
      text: "La frontière d'un trou noir. Rien de ce qui se trouve à l'intérieur, pas même la lumière, ne peut jamais en sortir.",
    },
    {
      title: "Singularité",
      text: "Le point où la relativité générale prédit une densité infinie, au centre d'un trou noir. Il marque très probablement la limite de la théorie, et non un véritable infini.",
    },
    {
      title: "Sphère de photons",
      text: "Le rayon auquel la lumière peut tourner en cercle autour d'un trou noir. Cette orbite est instable : la moindre poussée envoie la lumière vers l'intérieur ou vers l'extérieur.",
    },
    {
      title: "Ombre",
      text: "La tache sombre qu'un trou noir dessine sur le ciel : l'ensemble des directions d'où aucune lumière ne vous parvient. Elle est environ 2,6 fois plus large que l'horizon.",
    },
    {
      title: "Disque d'accrétion",
      text: "Un disque plat de gaz qui tombe en spirale vers un trou noir, chauffé par frottement jusqu'à briller.",
    },
    {
      title: "ISCO",
      text: "La dernière orbite circulaire stable (innermost stable circular orbit) : l'orbite la plus proche possible avant que le gaz ne plonge. La rotation la rapproche du trou pour le gaz qui tourne dans le même sens.",
    },
    {
      title: "Entraînement des référentiels",
      text: "Une masse en rotation entraîne l'espace-temps avec elle : près d'un trou noir en rotation, rien ne peut rester immobile.",
    },
    {
      title: "Ergosphère",
      text: "La région située juste à l'extérieur de l'horizon d'un trou noir en rotation, où l'entraînement des référentiels est si fort que rien ne peut rester immobile.",
    },
    {
      title: "Spaghettification",
      text: "L'étirement d'un objet qui tombe sous l'effet des forces de marée : la gravité tire plus fort sur son extrémité proche que sur son extrémité éloignée.",
    },
    {
      title: "Rayonnement de Hawking",
      text: "La faible lueur thermique que les effets quantiques devraient donner à tout trou noir, et qui le fait lentement s'évaporer.",
    },
    {
      title: "Lentille gravitationnelle",
      text: "La déviation de la lumière par la masse. Elle agrandit, déforme et démultiplie tout ce qui se trouve derrière.",
    },
    {
      title: "Décalage vers le rouge gravitationnel",
      text: "La lumière qui s'extrait d'un puits de gravité perd de l'énergie et se décale vers le rouge.",
    },
    {
      title: "Focalisation relativiste",
      text: "Une source qui s'approche de vous paraît plus brillante, et une source qui s'éloigne plus sombre, bien au-delà de l'effet Doppler ordinaire.",
    },
    {
      title: "Chute libre",
      text: "Un mouvement soumis à la seule gravité, sans fusée ni sol pour s'y opposer. Un observateur en chute libre se sent en apesanteur, et franchit l'horizon d'un trou noir sans s'en apercevoir.",
    },
    {
      title: "Pont d'Einstein-Rosen",
      text: "Dans le trou noir idéalisé et éternel, un tunnel vers un second univers. Il se referme trop vite pour que quoi que ce soit le traverse, et les vrais trous noirs, nés de l'effondrement d'étoiles, n'en ont pas.",
    },
    {
      title: "Gorge",
      text: "La partie la plus étroite d'un trou de ver, là où ses sphères ont leur plus petit rayon ρ.",
    },
    {
      title: "Rapidité",
      text: "Une mesure de la vitesse qui s'additionne simplement : deux poussées de η₁ et η₂ donnent η₁ + η₂, tandis que la vitesse tanh η n'atteint jamais c.",
    },
    {
      title: "Aberration",
      text: "Le changement de direction apparente de la lumière dû à votre propre mouvement.",
    },
  ],
  credits: [
    {
      text: "Vidéo de ScienceClic English (Alessandro Roussel) : ",
    },
    {
      text: "Shaders d'aroussel sur Shadertoy : ",
    },
    {
      text: "Carte du ciel : NASA/Goddard Space Flight Center Scientific Visualization Studio, ",
    },
    {
      text: "O. James, E. von Tunzelmann, P. Franklin et K. S. Thorne, ",
    },
    {
      text: "O. James, E. von Tunzelmann, P. Franklin et K. S. Thorne, ",
    },
    {
      text: "Collaboration Event Horizon Telescope, ",
    },
    {
      text: "Collaboration Event Horizon Telescope, ",
    },
    {
      text: "A. J. S. Hamilton et J. P. Lisle, ",
    },
    {
      text: "M. Moroz, ",
    },
    {
      text: "A. J. S. Hamilton, ",
    },
  ],
};
