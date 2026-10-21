/* =====================================================================
   CLIQUE EDITE — CONTEÚDO DAS DEMONSTRAÇÕES
   ---------------------------------------------------------------------
   Textos das simulações, exemplos da galeria, prévia do mapa mental
   e perguntas frequentes. A copy comercial dos blocos fica no
   index.html, separada por comentários de bloco.

   IMPORTANTE: as falas da "IA" abaixo são roteiros de simulação
   explicativa, exibidos com o selo "Simulação". Antes de publicar,
   confira se elas correspondem ao que o arquivo realmente faz.
   ===================================================================== */

/* ---------- BLOCO 02 · Demonstração de comando (5 etapas) ---------- */
export const COMMAND_DEMOS = [
  {
    id: 'instagram',
    label: 'Vídeo para Instagram',
    command: 'Transforma essa gravação em um Reels de 30 segundos, com um começo que chame atenção.',
    summary: 'A IA entende o pedido, ajuda a organizar as cenas, preparar os textos e orientar a edição.',
    steps: [
      { title: 'Comando enviado',
        body: 'Você escreve ou dita o pedido no Claude, com o arquivo Clique Edite já adicionado.',
        bubble: { from: 'user', text: 'Quero transformar essa ideia em um vídeo para o Instagram.' } },
      { title: 'Interpretação do pedido',
        body: 'O assistente identifica o objetivo e o formato, e pergunta o que falta.',
        bubble: { from: 'ai', text: 'Entendi: um vídeo curto e vertical para o Instagram. Me conta a ideia em uma frase e diga se você já tem gravações ou imagens.' } },
      { title: 'Organização das ações',
        body: 'O pedido vira um plano em partes, antes de qualquer edição.',
        list: ['Gancho para os primeiros segundos', 'Desenvolvimento da ideia em poucas cenas', 'Texto de tela para cada cena', 'Chamada final para o público'] },
      { title: 'Execução com recursos compatíveis',
        body: 'O assistente escreve o roteiro e os textos. A montagem do arquivo de vídeo depende das ferramentas disponíveis no seu ambiente.',
        list: ['Roteiro dividido em cenas', 'Textos de tela e legenda do post', 'Orientações de corte para o seu material'] },
      { title: 'Resultado ou prévia',
        body: 'Você recebe a prévia e pede ajustes na mesma conversa.',
        bubble: { from: 'ai', text: 'Pronto: roteiro em 3 cenas, textos de tela e legenda do post. Quer um gancho mais direto ou uma versão mais curta?' } },
    ],
  },
  {
    id: 'anuncio',
    label: 'Anúncio de produto',
    command: 'Quero transformar essa ideia em um anúncio para vender meu produto.',
    summary: 'A IA ajuda a criar uma abertura forte, apresentar o produto e terminar com uma chamada para ação.',
    steps: [
      { title: 'Comando enviado',
        body: 'Você escreve ou dita o pedido no Claude, com o arquivo Clique Edite já adicionado.',
        bubble: { from: 'user', text: 'Quero criar um anúncio para o meu produto.' } },
      { title: 'Interpretação do pedido',
        body: 'O assistente entende que é um vídeo de venda e levanta as informações do produto.',
        bubble: { from: 'ai', text: 'Vamos montar um anúncio. Qual é o produto, para quem ele é e qual o principal resultado que ele entrega?' } },
      { title: 'Organização das ações',
        body: 'O anúncio é dividido nas partes que um vídeo de venda precisa ter.',
        list: ['Abertura que chama a atenção', 'Apresentação do produto', 'Resposta à principal objeção', 'Chamada para a compra'] },
      { title: 'Execução com recursos compatíveis',
        body: 'O assistente produz o roteiro e as variações de texto. A edição do vídeo depende das ferramentas disponíveis no seu ambiente.',
        list: ['Roteiro do anúncio', 'Variações de abertura para testar', 'Textos de tela e orientações de edição'] },
      { title: 'Resultado ou prévia',
        body: 'Você revisa, escolhe a versão e pede ajustes.',
        bubble: { from: 'ai', text: 'Aqui está o roteiro com 3 aberturas diferentes. Quer que eu adapte para 15 ou para 30 segundos?' } },
    ],
  },
];

/* ---------- BLOCO 03 · Comparação de processos ---------- */
export const PROCESSES = {
  traditional: {
    label: 'Processo tradicional',
    steps: [
      { t: 'Abrir um programa de edição.', short: 'Abrir programa de edição', d: 'Escolher e aprender um programa de edição.' },
      { t: 'Organizar todas as gravações.', short: 'Organizar gravações', d: 'Importar gravações, imagens e áudios no lugar certo.' },
      { t: 'Cortar erros e pausas.', short: 'Cortar erros e pausas', d: 'Encontrar cada pausa e erro na linha do tempo.' },
      { t: 'Colocar legendas e textos.', short: 'Colocar legendas e textos', d: 'Criar, posicionar e sincronizar cada texto na tela.' },
      { t: 'Ajustar efeitos e cenas.', short: 'Ajustar efeitos e cenas', d: 'Cores, transições, áudio e enquadramento, um a um.' },
      { t: 'Revisar tudo novamente.', short: 'Revisar tudo de novo', d: 'Assistir de novo e voltar aos passos anteriores.' },
      { t: 'Exportar o vídeo.', short: 'Exportar e esperar', d: 'Escolher formato, resolução e esperar a renderização.' },
    ],
  },
  assisted: {
    label: 'Processo com IA',
    steps: [
      { who: 'Você', t: 'Abrir sua IA.', short: 'Abrir sua IA', d: 'No computador ou no celular.' },
      { who: 'Você', t: 'Adicionar o Clique Edite.', short: 'Adicionar o Clique Edite', d: 'Seguindo o vídeo de instrução.' },
      { who: 'Você', t: 'Enviar sua gravação ou ideia.', short: 'Enviar gravação ou ideia', d: 'Gravações, imagens ou só a ideia.' },
      { who: 'Você', t: 'Dizer o que precisa.', short: 'Dizer o que precisa', d: 'Escrevendo ou ditando pelo microfone.' },
      { who: 'IA ajuda', t: 'Deixar a IA ajudar na edição.', short: 'A IA ajuda na edição', d: 'Dentro do que suas ferramentas permitem.' },
      { who: 'Você + IA', t: 'Conferir e ajustar o resultado.', short: 'Conferir e aprovar', d: 'Você revisa e pede novos ajustes.' },
    ],
  },
};

/* ---------- BLOCO 04 · Demonstração guiada ---------- */
// Etapa 1 — confirme com o procedimento real de instalação do arquivo.
export const INSTALL_STEPS = [
  { t: 'Receba o arquivo', d: 'Depois da compra, você recebe o arquivo Clique Edite e as instruções.' },
  { t: 'Abra o Claude', d: 'No computador ou no celular, na sua conta do Claude.' },
  { t: 'Adicione o arquivo', d: 'Siga as instruções que acompanham o arquivo para adicioná-lo ao seu Claude.' },
  { t: 'Assistente pronto', d: 'O Claude passa a responder como seu assistente de criação e edição de vídeos.' },
];

// Etapa 2 e 3 — comandos selecionáveis e o processamento de cada um.
export const GUIDED_COMMANDS = [
  {
    id: 'produto',
    command: 'Quero um vídeo curto para divulgar meu produto.',
    process: ['Entende o objetivo: divulgação, vídeo curto', 'Pergunta qual é o produto e o público', 'Organiza gancho, apresentação e chamada final', 'Escreve roteiro e textos de tela'],
    result: 'Roteiro de vídeo curto com gancho, apresentação do produto e chamada final, mais os textos de tela.',
    adjust: { ask: 'Deixa a abertura mais direta.', answer: 'Troquei a abertura por uma frase que mostra o resultado do produto logo no começo.' },
  },
  {
    id: 'reels',
    command: 'Transforma esse texto num Reels de 30 segundos.',
    process: ['Lê o texto que você enviou', 'Separa a ideia principal', 'Divide em cenas que cabem em 30 segundos', 'Sugere os textos de tela de cada cena'],
    result: 'Texto adaptado em cenas para um Reels de cerca de 30 segundos, com o que falar e o que mostrar em cada uma.',
    adjust: { ask: 'Pode cortar para 20 segundos?', answer: 'Juntei duas cenas e enxuguei as falas para caber em cerca de 20 segundos.' },
  },
  {
    id: 'empresa',
    command: 'Quero um vídeo apresentando minha empresa.',
    process: ['Entende o objetivo: apresentação institucional', 'Pergunta o que a empresa faz e seus diferenciais', 'Organiza quem somos, diferenciais e contato', 'Escreve roteiro e lista de cenas para gravar'],
    result: 'Roteiro institucional com a apresentação da empresa, os diferenciais e o encerramento, mais a lista de cenas para gravar.',
    adjust: { ask: 'Coloca um tom mais próximo, menos formal.', answer: 'Reescrevi as falas num tom de conversa, mantendo a mesma estrutura.' },
  },
];

/* ---------- BLOCO 05 · Galeria de exemplos ----------
   Para trocar a ilustração por um vídeo REAL feito com o produto:
   • src: arquivo .mp4 (ex.: 'assets/media/reels-dica.mp4'), ou
   • instagram: link de um post/reel (ex.: 'https://www.instagram.com/reel/XXXX/')
   mock: ilustração exibida enquanto não há vídeo (marcada "Ilustração").
   resultSummary: preencha só quando houver o vídeo real. */
export const GALLERY = [
  {
    id: 'social', icon: '📱', label: 'Vídeos para redes sociais',
    description: 'Crie Reels, TikToks e conteúdos curtos sem ficar perdido na edição.',
    examples: [
      { title: 'Reels de dica rápida', goal: 'Ensinar uma dica em poucos segundos.',
        command: 'Transforma essa dica num Reels curto, com texto na tela.',
        mock: { hook: '3 erros que travam seus Reels', caption: 'o primeiro é o mais comum', tone: 'gold' },
        demo: 'reel-dica', real: true, src: '', instagram: '', poster: '', captions: '', resultSummary: '' },
      { title: 'Bastidores do negócio', goal: 'Aproximar o público da sua rotina.',
        command: 'Organiza essas gravações do meu dia num vídeo de bastidores.',
        mock: { hook: 'Um dia no meu negócio', caption: '06:30 · começa assim', tone: 'ember' },
        demo: 'reel-bastidores', real: true, src: '', instagram: '', poster: '', captions: '', resultSummary: '' },
    ],
  },
  {
    id: 'ads', icon: '🚀', label: 'Anúncios para vender',
    description: 'Transforme suas ideias em vídeos de anúncios para divulgar seus produtos e serviços.',
    examples: [
      { title: 'Anúncio de produto', goal: 'Apresentar o produto e levar ao clique.',
        command: 'Quero criar um anúncio para o meu produto.',
        mock: { hook: 'Cansado de editar por horas?', caption: 'olha o que mudou aqui', tone: 'steel' },
        demo: 'reel-anuncio', src: '', instagram: '', poster: '', captions: '', resultSummary: '' },
      { title: 'Variações de abertura', goal: 'Testar começos diferentes no mesmo anúncio.',
        command: 'Cria 3 aberturas diferentes para esse anúncio.',
        mock: { hook: 'Abertura A · B · C', caption: 'qual prende mais?', tone: 'gold' },
        demo: 'reel-abertura-1', demos: ['reel-abertura-1', 'reel-abertura-2'], real: true, src: '', instagram: '', poster: '', captions: '', resultSummary: '' },
    ],
  },
  {
    id: 'company', icon: '🎬', label: 'Vídeos para sua empresa',
    description: 'Crie vídeos para apresentar seu negócio, mostrar seu trabalho e divulgar seus serviços.',
    examples: [
      { title: 'Apresentação da empresa', goal: 'Mostrar quem vocês são e o que fazem.',
        command: 'Quero um vídeo apresentando minha empresa.',
        mock: { hook: 'Prazer, somos a sua marca', caption: 'há anos fazendo isso', tone: 'ember' },
        demo: 'reel-empresa', src: '', instagram: '', poster: '', captions: '', resultSummary: '' },
      { title: 'Vídeo de serviço', goal: 'Explicar um serviço e como contratar.',
        command: 'Monta um vídeo explicando esse serviço passo a passo.',
        mock: { hook: 'Como funciona, em 3 passos', caption: 'passo 1 · o diagnóstico', tone: 'steel' },
        demo: 'reel-servico', src: '', instagram: '', poster: '', captions: '', resultSummary: '' },
    ],
  },
];

/* ---------- BLOCO 06 · Simulador de solicitações ---------- */
export const REQUESTS = [
  {
    id: 'curto',
    short: 'Encurtar',
    label: 'Quer um vídeo mais curto?',
    ask: 'Remove as pausas e deixa esse vídeo com 30 segundos.',
    action: 'Encontrar pausas, repetições e trechos que não mudam a mensagem, e propor o que sai.',
    result: 'Lista de cortes por trecho, para você aprovar, mantendo a fala principal.',
    next: { ask: 'Agora deixa com no máximo 30 segundos.', answer: 'Proponho cortar a introdução e a segunda explicação. O restante cabe em cerca de 30 segundos.' },
  },
  {
    id: 'mensagem',
    short: 'Melhorar',
    label: 'Quer melhorar seu vídeo?',
    ask: 'Coloca uma abertura mais forte e deixa a mensagem mais dinâmica.',
    action: 'Ler o que é dito, apontar onde a ideia se perde e sugerir uma ordem mais clara.',
    result: 'Nova versão do roteiro, com abertura mais forte e a ideia principal dita mais cedo.',
    next: { ask: 'Deixa o final mais convidativo.', answer: 'Troquei o encerramento por uma chamada que convida a pessoa a comentar a própria experiência.' },
  },
  {
    id: 'anuncio',
    short: 'Anúncio',
    label: 'Quer criar um anúncio?',
    ask: 'Transforma essa gravação em um anúncio para o meu produto.',
    action: 'Transformar a ideia em estrutura de venda: atenção, apresentação, objeção e chamada.',
    result: 'Roteiro de anúncio com abertura, apresentação do produto e chamada para a compra.',
    next: { ask: 'Faz uma versão de 15 segundos.', answer: 'Mantive só a abertura, um benefício e a chamada final, para caber em cerca de 15 segundos.' },
  },
];

/* ---------- BLOCO 07 · Demonstração do arquivo ---------- */
export const FILE_DEMO = [
  { id: 'oque', label: 'O que é', title: 'Um arquivo de instruções para a sua IA',
    body: 'O Clique Edite é um arquivo que orienta uma IA compatível a trabalhar como assistente de criação e edição de vídeos. Você não precisa escrever comandos difíceis.' },
  { id: 'onde', label: 'Onde usa', title: 'Na sua IA',
    body: 'Ele é usado dentro de uma IA compatível, no computador ou no celular. Algumas edições e exportações dependem de ferramentas compatíveis.' },
  { id: 'como', label: 'Como adiciona', title: 'Seguindo o vídeo de instrução',
    body: 'Você recebe o arquivo e um vídeo com o passo a passo depois da compra. É só seguir para adicionar o arquivo à sua IA.' },
  { id: 'depois', label: 'Depois da instalação', title: 'Você pede, a IA ajuda',
    body: 'Basta escrever ou ditar o que você quer criar. A IA organiza o pedido, ajuda a criar e você pede ajustes na mesma conversa.' },
];

/* ---------- BLOCO 07 · Prévia do mapa mental ----------
   PRÉVIA DEMONSTRATIVA da organização do mapa. Substitua pelos
   tópicos reais do Mapa Mental de Criação de Vídeos antes de publicar. */
export const MINDMAP = {
  isDemo: true,
  root: 'Mapa Mental de Criação de Vídeos',
  areas: [
    {
      id: 'social', label: 'Redes sociais', icon: '📱',
      branches: [
        { label: 'O que falar', topics: ['Um assunto por vídeo', 'Falar com quem assiste', 'Exemplo do dia a dia'],
          ask: 'Me ajuda a escolher um assunto para um vídeo curto sobre o meu negócio.' },
        { label: 'Como prender a atenção', topics: ['Pergunta ou promessa na abertura', 'Resultado logo no início', 'Mudança de cena ou texto'],
          ask: 'Cria 3 ganchos para os primeiros segundos desse vídeo.' },
        { label: 'Como terminar', topics: ['Resumo em uma frase', 'Pedido de ação', 'Ponte para o próximo conteúdo'],
          ask: 'Escreve um final que convide a pessoa a salvar o vídeo.' },
      ],
    },
    {
      id: 'ads', label: 'Anúncios', icon: '🚀',
      branches: [
        { label: 'Chamar a atenção', topics: ['Dor ou desejo do cliente', 'Produto em uso', 'Texto de tela forte'],
          ask: 'Cria uma abertura de anúncio que fale da principal dor do meu cliente.' },
        { label: 'Apresentar o produto', topics: ['O que é', 'Para quem serve', 'O que muda depois'],
          ask: 'Explica meu produto em 3 frases simples para um anúncio.' },
        { label: 'Incentivar a compra', topics: ['Condição de compra', 'Resposta à objeção', 'Chamada clara'],
          ask: 'Escreve uma chamada final para o anúncio levar à compra.' },
      ],
    },
    {
      id: 'company', label: 'Vídeos institucionais', icon: '🎬',
      branches: [
        { label: 'Apresentar a empresa', topics: ['Quem vocês são', 'O que fazem', 'Onde atendem'],
          ask: 'Monta a abertura de um vídeo apresentando minha empresa.' },
        { label: 'Mostrar diferenciais', topics: ['O que fazem diferente', 'Bastidores do trabalho', 'Como é o atendimento'],
          ask: 'Me ajuda a mostrar os diferenciais da minha empresa em vídeo.' },
        { label: 'Transmitir confiança', topics: ['Equipe e espaço reais', 'Clientes atendidos', 'Como começar'],
          ask: 'Sugere cenas que transmitam confiança num vídeo institucional.' },
      ],
    },
  ],
};

/* ---------- BLOCO 09 · Perguntas frequentes (copy obrigatória) ---------- */
export const FAQ = [
  { q: 'Preciso saber editar vídeos?',
    a: 'Não! Você só precisa dizer o que quer criar ou mudar. A IA ajuda na edição, e você acompanha o resultado.' },
  { q: 'Como faço para começar?',
    a: 'Você recebe o arquivo e um vídeo com o passo a passo. Basta adicionar o arquivo a uma IA compatível e começar a enviar seus pedidos.' },
  { q: 'Posso mandar comandos por áudio?',
    a: 'Sim! Se seu celular ou computador tiver microfone com digitação por voz, basta falar o que deseja e enviar o comando.' },
  { q: 'Que tipos de vídeos posso criar?',
    a: 'Reels, anúncios, vídeos para redes sociais e apresentações do seu negócio.' },
  { q: 'O Claude faz tudo sozinho?',
    a: 'A IA ajuda a criar, organizar e editar seus vídeos. Algumas tarefas podem depender de outras ferramentas ou da sua aprovação.' },
  { q: 'O que é o mapa mental?',
    a: 'É um guia simples que mostra como organizar suas ideias para saber o que pedir à IA.' },
  { q: 'Preciso pagar pelo Claude?',
    a: 'O Clique Edite é uma compra única. Você pode utilizar os recursos disponíveis em plataformas compatíveis, como Claude, ChatGPT ou Gemini, respeitando as funções e os limites de cada uma.' },
  { q: 'Tem garantia?',
    a: 'Sim. Você tem 7 dias para testar. Se não funcionar como prometido ou simplesmente não gostar, pode pedir 100% do seu dinheiro de volta nesse período.' },
];

/* ---------- VÍDEOS DE DEMONSTRAÇÃO (assets/media/demo) ----------
   Simulações e ilustrações em vídeo, geradas para a página e marcadas
   como tal dentro do próprio vídeo. Capítulos em segundos. */
export const DEMO_CHAPTERS = {
  "cmd-instagram": [
    {
      t: 0,
      label: "Comando enviado"
    },
    {
      t: 3,
      label: "Interpretação"
    },
    {
      t: 6,
      label: "Organização"
    },
    {
      t: 9,
      label: "Execução"
    },
    {
      t: 12,
      label: "Resultado"
    }
  ],
  "cmd-anuncio": [
    {
      t: 0,
      label: "Comando enviado"
    },
    {
      t: 3,
      label: "Interpretação"
    },
    {
      t: 6,
      label: "Organização"
    },
    {
      t: 9,
      label: "Execução"
    },
    {
      t: 12,
      label: "Resultado"
    }
  ],
  "guiado": [
    {
      t: 0,
      label: "Adicione o arquivo"
    },
    {
      t: 6.5,
      label: "Diga o que quer criar"
    },
    {
      t: 11.5,
      label: "A IA ajuda a criar"
    }
  ],
  "pedido-curto": [
    {
      t: 0,
      label: "Pedido"
    },
    {
      t: 2.8,
      label: "Proposta"
    },
    {
      t: 5.6,
      label: "Resultado"
    },
    {
      t: 8.2,
      label: "Novo ajuste"
    }
  ],
  "pedido-mensagem": [
    {
      t: 0,
      label: "Pedido"
    },
    {
      t: 2.8,
      label: "Proposta"
    },
    {
      t: 5.6,
      label: "Resultado"
    },
    {
      t: 8.2,
      label: "Novo ajuste"
    }
  ],
  "pedido-anuncio": [
    {
      t: 0,
      label: "Pedido"
    },
    {
      t: 2.8,
      label: "Proposta"
    },
    {
      t: 5.6,
      label: "Resultado"
    },
    {
      t: 8.2,
      label: "Novo ajuste"
    }
  ]
};
