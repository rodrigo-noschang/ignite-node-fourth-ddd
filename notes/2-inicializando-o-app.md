# Inicializando o App:
A aplicação vai ser uma espécie de fórum. 

Primeiro vamos criar um projetinho Node com Typescript padrão, e vamos criar a pasta src e uma pasta domain dentro dela. Nessa pasta domain, vai existir tudo que foi comentado no arquivo anterior, ou seja, a parte mais interna da aplicação que deve existir de forma limpa e independente. As primeiras coisas que vamos determinar são as **entidades** e os **casos de uso**:

- **Entidades**: Nas entidades, teremos todos os elementos que compõe a nossa aplicação. Se esse fórum, por exemplo, é feito para que professores possam responder dúvidas dos alunos, já podemos suspeitar que as entidades dessa aplicação são: *alunos*, *professores* e *duvidas*. 

- **Casos de Uso**: Como as entidades definidas vão interagir entre si. Então se os professores precisam responder os alunos, professores e alunos são as entidades, e a *resposta* é um caso de uso, é uma ação que deve acontecer entre eles. 

Tanto as Entidades, quando os Casos de Uso são todos definidos através de conversas com os **Domain Experts**. Para dar um exemplo de como essas separações podem ser feitas, vamos criar na pasta `src/domain/entities`, um arquivo chamado `instructor.ts` e `question.ts`, que são as entidades professor e dúvida. Como a dúvida deve vir de algum aluno, vamos criar o `student.ts`.

Um primeiro caso de uso que vem à mente, envolvendo essas duas entidades, é *o professor responder a duvida/questão*. Então, em uma pasta `src/domain/use-cases`, vamos criar `answer-question.ts`.

Por enquanto, vamos fazer uma divisão da forma mais simples possível, sem pensar em frameworks, banco de dados, tabelas, nem nada do tipo. Além disso, de maneira geral, a forma da implementação das entidades e casos de uso é bastante livre, não há um consenso nem uma regra imposta pelo DDD mas, na nossa aplicação, faremos seguindo o POO.