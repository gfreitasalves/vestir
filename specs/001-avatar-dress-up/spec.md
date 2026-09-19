# Feature Specification: Jogo de Vestir Avatares

**Feature Branch**: `001-avatar-dress-up`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Um joguinho de vestir avatares. O usuário pode configurar/personalizar um avatar (personagem) e vesti-lo com roupas de diferentes categorias, como vestido, short, calça, blusa, entre outras peças. O jogo deve permitir trocar as roupas do avatar e ver o resultado visualmente, como um jogo de \"dress up\" de boneca virtual."

## Clarifications

### Session 2026-09-19

- Q: Quando nenhuma peça está selecionada em uma categoria, o que o avatar deve mostrar? → A: Pele/roupa íntima básica do avatar fica à mostra naquela parte do corpo.
- Q: Além de tom de pele e cabelo, a personalização do avatar deve incluir tipo de corpo (altura, contorno)? → A: Não nesta versão — corpo único/padrão; personalização limitada a tom de pele e cabelo.
- Q: O jogador pode usar vários acessórios ao mesmo tempo, ou "acessório" é um slot único como as outras categorias? → A: Acessório é um slot único (uma peça por vez), igual às demais categorias.
- Q: Quantas peças de roupa, no mínimo, cada categoria deve ter disponíveis no lançamento? → A: 3 a 5 itens por categoria.
- Q: Qual estilo visual o avatar e as roupas devem ter? → A: Ilustração 2D estilo "funko/chibi" (proporções estilizadas: cabeça grande, corpo pequeno/arredondado, poucos detalhes), exibida de frente e empilhada por categoria, sem rotação 3D.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vestir o avatar com roupas (Priority: P1)

Como jogador, eu quero escolher peças de roupa de diferentes categorias (vestido, blusa, calça, short, sapato, acessório) e ver o avatar vestido com elas na hora, para montar o visual que eu quiser, como em um jogo de boneca de vestir.

**Why this priority**: É o núcleo do jogo — sem essa interação não existe "jogo de vestir". Todo o resto (configurar o avatar, salvar o look) só faz sentido em função dessa mecânica.

**Independent Test**: Pode ser testado sozinho carregando um avatar padrão, selecionando peças de pelo menos duas categorias diferentes (ex: uma blusa e uma calça) e confirmando que o avatar exibido é atualizado visualmente com cada peça escolhida.

**Acceptance Scenarios**:

1. **Given** o avatar está sem nenhuma roupa selecionada em uma categoria, **When** o jogador escolhe uma peça dessa categoria (ex: uma blusa), **Then** o avatar passa a exibir aquela peça visualmente.
2. **Given** o avatar já está vestindo uma peça em uma categoria (ex: uma calça), **When** o jogador escolhe outra peça da mesma categoria (ex: um short), **Then** a peça anterior é substituída pela nova na exibição do avatar.
3. **Given** o avatar está vestindo uma peça, **When** o jogador escolhe a opção de remover/nenhuma peça naquela categoria, **Then** o avatar deixa de exibir aquela peça e passa a mostrar a pele/roupa íntima básica naquela parte do corpo.
4. **Given** o avatar está vestindo uma blusa e uma calça, **When** o jogador seleciona um vestido, **Then** o vestido substitui tanto a blusa quanto a calça na exibição do avatar (vestido ocupa as duas partes do corpo ao mesmo tempo).

---

### User Story 2 - Configurar/personalizar o avatar (Priority: P2)

Como jogador, eu quero personalizar as características do avatar antes de vesti-lo (como tom de pele e cabelo), para que o personagem se pareça com o que eu quero antes de escolher as roupas.

**Why this priority**: Complementa a experiência principal dando identidade ao avatar, mas o jogo continua funcional e demonstrável mesmo usando um avatar padrão sem essa personalização.

**Independent Test**: Pode ser testado sozinho abrindo a tela de configuração do avatar, alterando pelo menos um atributo (ex: tom de pele) e confirmando que a aparência do avatar exibido muda de acordo.

**Acceptance Scenarios**:

1. **Given** o jogador está na tela de configuração do avatar, **When** ele escolhe um tom de pele diferente, **Then** o avatar exibido passa a ter o novo tom de pele.
2. **Given** o jogador está na tela de configuração do avatar, **When** ele escolhe um estilo/cor de cabelo diferente, **Then** o avatar exibido passa a ter o novo cabelo.
3. **Given** o jogador alterou as características do avatar, **When** ele vai para a tela de vestir roupas, **Then** o avatar mantém as características configuradas (pele, cabelo etc.) junto com as roupas escolhidas.

---

### User Story 3 - Continuar de onde parou (Priority: P3)

Como jogador, eu quero que o avatar e o look que montei continuem salvos quando eu fechar e reabrir o jogo no mesmo dispositivo, para não precisar remontar tudo do zero toda vez.

**Why this priority**: Melhora a experiência e a retenção, mas o jogo já é jogável e demonstrável sem persistência — o jogador só perderia o progresso ao recarregar.

**Independent Test**: Pode ser testado sozinho configurando um avatar com roupas específicas, recarregando o jogo (ex: fechando e abrindo a aba/app novamente) e confirmando que o mesmo avatar e as mesmas roupas aparecem.

**Acceptance Scenarios**:

1. **Given** o jogador configurou um avatar e escolheu roupas, **When** ele fecha e reabre o jogo no mesmo dispositivo, **Then** o avatar aparece com as mesmas configurações e roupas de antes.
2. **Given** o jogador nunca configurou um avatar antes, **When** ele abre o jogo pela primeira vez, **Then** um avatar padrão é exibido, pronto para ser personalizado.

---

### Edge Cases

- O que acontece quando o jogador tenta vestir uma peça em uma categoria que já está ocupada por um vestido (que ocupa parte de cima e de baixo)? O sistema deve liberar o slot correspondente do vestido (remover o vestido) para permitir a nova peça, já que um vestido não pode coexistir com blusa ou calça/short ocupando a mesma parte do corpo.
- O que acontece quando não há nenhuma peça disponível em uma categoria? A categoria não deve ser exibida como selecionável, ou deve indicar claramente que está vazia.
- O que o avatar exibe quando uma categoria não tem nenhuma peça selecionada (estado inicial ou após remoção)? A pele/roupa íntima básica do avatar fica visível naquela parte do corpo — o avatar nunca fica com uma "lacuna" ou espaço em branco.
- O que acontece quando o jogador tenta acessar o jogo em um dispositivo/navegador diferente do usado antes? Como não há conta de usuário, o avatar não é encontrado e um avatar padrão é exibido (sem erro).
- O que acontece se os dados salvos localmente forem corrompidos ou apagados (ex: cache do navegador limpo)? O jogo deve iniciar normalmente com um avatar padrão, sem travar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir um avatar padrão para o jogador na primeira vez que o jogo for aberto, sem exigir cadastro ou login.
- **FR-002**: O sistema MUST permitir que o jogador personalize as características do avatar, incluindo no mínimo tom de pele e cabelo (estilo e cor). O avatar tem um único tipo/formato de corpo padrão nesta versão — sem variações de altura ou contorno corporal.
- **FR-003**: O sistema MUST organizar as roupas em categorias, incluindo no mínimo: vestido, blusa, calça, short, sapato e acessório. Cada categoria, incluindo acessório, é um slot único: o jogador pode ter no máximo uma peça selecionada por categoria de cada vez.
- **FR-004**: O sistema MUST permitir que o jogador selecione uma peça de roupa de uma categoria e ver essa peça aplicada visualmente ao avatar imediatamente.
- **FR-005**: O sistema MUST permitir que o jogador troque a peça selecionada em uma categoria por outra peça da mesma categoria, substituindo a anterior.
- **FR-006**: O sistema MUST permitir que o jogador remova uma peça de roupa de uma categoria, deixando a pele/roupa íntima básica do avatar à mostra naquela parte do corpo.
- **FR-007**: O sistema MUST tratar o "vestido" como uma peça que ocupa simultaneamente os slots de parte de cima e parte de baixo do corpo, substituindo automaticamente qualquer blusa, calça ou short selecionados quando um vestido for escolhido (e vice-versa: escolher uma blusa ou calça remove um vestido ativo).
- **FR-008**: O sistema MUST salvar automaticamente, no dispositivo do jogador, as características do avatar e as roupas escolhidas, sem exigir uma ação explícita de "salvar" nem login.
- **FR-009**: O sistema MUST restaurar o avatar e as roupas salvas automaticamente na próxima vez que o jogo for aberto no mesmo dispositivo.
- **FR-010**: O sistema MUST continuar funcionando normalmente (exibindo um avatar padrão) quando não houver dados salvos ou quando os dados salvos estiverem corrompidos/ilegíveis.
- **FR-011**: O sistema MUST suportar apenas um avatar por jogador (sem múltiplos avatares salvos simultaneamente) nesta versão.
- **FR-012**: O sistema MUST disponibilizar, no lançamento, pelo menos 3 a 5 peças de roupa distintas em cada categoria (vestido, blusa, calça, short, sapato, acessório), para permitir combinações variadas de visual.
- **FR-013**: O sistema MUST exibir o avatar e as roupas como ilustrações 2D em estilo "funko/chibi" (proporções estilizadas, cabeça grande, corpo pequeno/arredondado), vistas de frente e empilhadas por categoria sobre o corpo do avatar, sem rotação ou visualização 3D.

### Key Entities

- **Avatar**: Representa o personagem do jogador. Atributos principais: tom de pele, estilo de cabelo, cor de cabelo (corpo em formato único/padrão, não configurável, ilustrado em estilo 2D "funko/chibi"), e o conjunto de roupas atualmente vestidas (no máximo uma peça por categoria/slot do corpo; slots sem peça exibem a pele/roupa íntima básica).
- **Peça de Roupa (Clothing Item)**: Representa um item vestível. Atributos principais: categoria (vestido, blusa, calça, short, sapato, acessório), slot(s) do corpo que ocupa, e a ilustração 2D da peça (mesmo estilo "funko/chibi" do avatar, vista de frente).
- **Categoria de Roupa**: Agrupamento de peças do mesmo tipo (ex: todas as blusas), usado para organizar a seleção de roupas na interface.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um jogador consegue vestir o avatar com uma peça de roupa nova e ver o resultado visual em menos de 2 segundos após a escolha.
- **SC-002**: Um jogador consegue montar um visual completo (personalizar o avatar e escolher roupas para todas as categorias principais) em menos de 3 minutos na primeira vez que usa o jogo, sem instruções externas.
- **SC-003**: 100% das vezes que o jogo é reaberto no mesmo dispositivo após uma personalização, o avatar e as roupas salvas aparecem corretamente restaurados.
- **SC-004**: Um jogador consegue trocar de roupa em uma categoria (ex: trocar a blusa) e ver o avatar atualizado sem que nenhuma outra peça vestida em outra categoria (ex: sapato) seja alterada ou perdida.

## Assumptions

- O jogo é de jogador único (single-player), sem interação entre jogadores, compartilhamento social ou multiplayer nesta versão.
- Não há sistema de contas/login; o progresso é local ao dispositivo/navegador usado.
- O jogador tem apenas um avatar por vez (sem "guarda-roupa" de múltiplos personagens) nesta versão.
- O conjunto inicial de peças de roupa e opções de personalização (tons de pele, cabelos) é definido pelo time de desenvolvimento como conteúdo do jogo, não criado pelo próprio jogador (sem upload de roupas customizadas).
- O jogo é voltado para uso em navegador/dispositivo pessoal, sem requisitos específicos de acessibilidade além das práticas padrão de interfaces web.
- O avatar tem um único tipo/formato de corpo (sem variações de altura ou contorno); a pele/roupa íntima básica exibida quando uma categoria está vazia é neutra e não contém nudez explícita.
- A arte do avatar e das roupas é produzida como ilustrações 2D estáticas em estilo "funko/chibi" (uma única vista frontal por peça/variação), sem necessidade de modelagem 3D, animação ou múltiplos ângulos de câmera.
