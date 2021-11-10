const malraux = `Mais, encore une fois, de quoi vous mêlez-vous ? Pourquoi répondre de mes sentiments ?
C’est que j’ai cru que, dans cette occasion-ci, vos sentiments ressembleraient à ceux de tout le monde. Monsieur votre père me demande si vous êtes bien aise qu’il vous marie, si vous en avez quelque joie : moi, je lui réponds que oui ; cela va tout de suite ; et il n’y a peut-être que vous de fille au monde, pour qui ce oui-là ne soit pas vrai ; le non n’est pas naturel.
Le non n’est pas naturel ! quelle sotte naïveté ! Le mariage aurait donc de grands charmes pour vous ?
Eh bien, c’est encore oui, par exemple.
Taisez-vous ; allez répondre vos impertinences ailleurs, et sachez que ce n’est pas à vous à juger de mon cœur par le vôtre.
Mon cœur est fait comme celui de tout le monde. De quoi le vôtre s’avise-t-il de n’être fait comme celui de personne ?
Je vous dis que, si elle osait, elle m’appellerait une originale.
Si j’étais votre égale, nous verrions.
Vous travaillez à me fâcher, Lisette.
Ce n’est pas mon dessein. Mais dans le fond, voyons, quel mal ai-je fait de dire à monsieur Orgon que vous étiez bien aise d’être mariée ?
Premièrement, c’est que tu n’as pas dit vrai ; je ne m’ennuie pas d’être fille.
Cela est encore tout neuf.
C’est qu’il n’est pas nécessaire que mon père croie me faire tant de plaisir en me mariant, parce que cela le fait agir avec une confiance qui ne servira peut-être de rien.
Quoi ! vous n’épouserez pas celui qu’il vous destine ?
Que sais-je ? peut-être ne me conviendra-t-il point, et cela m’inquiète.
On dit que votre futur est un des plus honnêtes hommes du monde ; qu’il est bien fait, aimable, de bonne mine ; qu’on ne peut pas avoir plus d’esprit, qu’on ne saurait être d’un meilleur caractère ; que voulez-vous de plus ? Peut-on se figurer de mariage plus doux, d’union plus délicieuse ?
Délicieuse ! que tu es folle avec tes expressions !
Ma foi, madame, c’est qu’il est heureux qu’un amant de cette espèce-là veuille se marier dans les formes ; il n’y a presque point de fille, s’il lui faisait la cour, qui ne fût en danger de l’épouser sans cérémonie. Aimable, bien fait, voilà de quoi vivre pour l’amour ; sociable et spirituel, voilà pour l’entretien de la société. Pardi ! tout en sera bon, dans cet homme-là ; l’utile et l’agréable, tout s’y trouve.
Oui dans le portrait que tu en fais, et on dit qu’il y ressemble, mais c’est un on dit, et je pourrais bien n’être pas de ce sentiment-là, moi. Il est bel homme, dit-on, et c’est presque tant pis.
Tant pis ! tant pis ! mais voilà une pensée bien hétéroclite !
C’est une pensée de très bon sens. Volontiers un bel homme est fat ; je l’ai remarqué.
Oh ! il a tort d’être fat ; mais il a raison d’être beau.
On ajoute qu’il est bien fait ; passe !
Oui-da ; cela est pardonnable.
De beauté et de bonne mine je l’en dispense ; ce sont là des agréments superflus.
Vertuchoux ! si je me marie jamais, ce superflu-là sera mon nécessaire.
Tu ne sais ce que tu dis. Dans le mariage, on a plus souvent affaire à l’homme raisonnable qu’à l’aimable homme ; en un mot, je ne lui demande qu’un bon caractère, et cela est plus difficile à trouver qu’on ne pense. On loue beaucoup le sien ; mais qui est-ce qui a vécu avec lui ? Les hommes ne se contrefont-ils pas, surtout quand ils ont de l’esprit ? N’en ai-je pas vu moi, qui paraissaient avec leurs amis les meilleures gens du monde ? C’est la douceur, la raison, l’enjouement même, il n’y a pas jusqu’à leur physionomie qui ne soit garante de toutes les bonnes qualités qu’on leur trouve. « Monsieur un tel a l’air d’un galant homme, d’un homme bien raisonnable, disait-on tous les jours d’Ergaste. — Aussi l’est-il, répondait-on ; je l’ai répondu moi-même ; sa physionomie ne vous ment pas d’un mot. » Oui, fiez-vous-y à cette physionomie si douce, si prévenante, qui disparaît un quart d’heure après pour faire place à un visage sombre, brutal, farouche qui devient l’effroi de toute une maison ! Ergaste s’est marié ; sa femme, ses enfants, son domestique ne lui connaissent encore que ce visage-là, pendant qu’il promène partout ailleurs cette physionomie si aimable que nous lui voyons, et qui n’est qu’un masque qu’il prend au sortir de chez lui.
Quel fantasque avec ces deux visages !
`.split('\n').filter(a => a);
export const sample_text = () => {
    return malraux[Math.floor(Math.random() * malraux.length)];
};