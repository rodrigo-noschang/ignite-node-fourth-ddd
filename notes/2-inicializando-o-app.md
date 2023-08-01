# Inicializando o App:
A aplicação vai ser uma espécie de fórum. 

Primeiro vamos criar um projetinho Node com Typescript padrão, e vamos criar a pasta src e uma pasta domain dentro dela. Nessa pasta domain, vai existir tudo que foi comentado no arquivo anterior, ou seja, a parte mais interna da aplicação que deve existir de forma limpa e independente. As primeiras coisas que vamos determinar são as **entidades** e os **casos de uso**:

- **Entidades**: Nas entidades, teremos todos os elementos que compõe a nossa aplicação. Se esse fórum, por exemplo, é feito para que professores possam responder dúvidas dos alunos, já podemos suspeitar que as entidades dessa aplicação são: *alunos*, *professores* e *duvidas*. 

- **Casos de Uso**: Como as entidades definidas vão interagir entre si. Então se os professores precisam responder os alunos, professores e alunos são as entidades, e a *resposta* é um caso de uso, é uma ação que deve acontecer entre eles. 

Tanto as Entidades, quando os Casos de Uso são todos definidos através de conversas com os **Domain Experts**. Para dar um exemplo de como essas separações podem ser feitas, vamos criar na pasta `src/domain/entities`, um arquivo chamado `instructor.ts` e `question.ts`, que são as entidades professor e dúvida. Como a dúvida deve vir de algum aluno, vamos criar o `student.ts`.

Um primeiro caso de uso que vem à mente, envolvendo essas duas entidades, é *o professor responder a duvida/questão*. Então, em uma pasta `src/domain/use-cases`, vamos criar `answer-question.ts`.

Por enquanto, vamos fazer uma divisão da forma mais simples possível, sem pensar em frameworks, banco de dados, tabelas, nem nada do tipo. Além disso, de maneira geral, a forma da implementação das entidades e casos de uso é bastante livre, não há um consenso nem uma regra imposta pelo DDD mas, na nossa aplicação, faremos seguindo o POO.

Vamos começar a implementação dessas entidades através de classes, da maneira mais crua e simples que podemos, pensando apenas no absoluto necessário para o momento: 

```ts
    class Question {
        public title: string;
        public content: string;

        constructor(title: string, content: string) {
            this.title = title;
            this.content = content;
        }
    }
```

E a classe Instructor e Student ficarão iguais, por enquanto:

```ts
    export class Student {
        public name: string;

        constructor(name: string) {
            this.name = name;
        }
    }
```

Agora, vamos tentar antecipar o nosso caso de usos, que permitirá que o instrutor responda a uma duvida de um aluno. Pensando nessa aplicação, já surge a necessidade de identificarmos as entidades envolvidas no processo: a pergunta em si, o aluno que a fez e o professor que está respondendo-a. Para isso, seguindo o padrão, vamos usar o uuid como identificador: 

```ts
import { randomUUID } from "node:crypto";

export class Instructor {
    public id: string;
    public name: string;

    constructor(name: string, id?: string) {
        this.id = id ?? randomUUID();
        this.name = name;
    }
}
```

Colocamos o id como um argumento opcional no constructor das entidades pois invocá-lo sem id, irá resultar na criação de uma nova instância da entidade, com um id randômico e, invocar com o id, fará apenas menção (ou busca) a uma instância já existente daquela entidade. 

Feito isso, no nosso método (caso de uso) de resposta de uma pergunta, agora já podemos identificar a pergunta e quem está respondendo ela:

```ts
    interface AnswerQuestionUseCaseRequest {
        instructorId: string
        questionId: string
    }

    export class AnswerQuestionUseCase {
        execute({ instructorId, questionId }: AnswerQuestionUseCaseRequest) {

        }
    }
```

Vamos precisar também de uma **resposta** para essa pergunta. Podemos supor que as respostas também serão entidades na nossa aplicação. Aqui é importante lembrar que **entidades** nesse contexto não é, necessariamente, o mesmo que entidades do banco de dados. Não é porque aqui conseguimos identificar 4 entidades diferentes, que teremos 4 tabelas no banco de dados. Nesse momento, estamos apenas destacando e separando os agentes envolvidos nas operações da aplicação. 

Vamos criar uma nova entidade para as **respostas**

```ts
    import { randomUUID } from "node:crypto";

    export class Answer {
        public id: string
        public content: string;

        constructor(content: string, id?: string) {
            this.content = content;
            this.id = id ?? randomUUID();
        }
    }
```

E agora, podemos criar uma resposta no nosso caso de uso:

```ts
    import { Answer } from "../entites/answer"

    interface AnswerQuestionUseCaseRequest {
        instructorId: string
        questionId: string
        content: string
    }

    export class AnswerQuestionUseCase {
        execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
            const answer = new Answer(content);

            return answer;
        }
    }
```

Com esse nosso protótipo de resposta elaborado, podemos já começar com os testes, e aqui já podemos utilizar as ferramentas de testes necessárias:

```ts
    import { expect, test } from 'vitest';
    import { AnswerQuestionUseCase } from './answer-question';

    test('create an answer', () => {
        const sut = new AnswerQuestionUseCase();

        const answer = sut.execute({
            instructorId: '1',
            questionId: '1',
            content: 'Nova resposta'
        });

        expect(answer.content).toEqual('Nova resposta');
    })
```

Nesse momento, o caso de uso e o teste estão extremamente simples e possivelmente (certamente) incompletos, mas já podemos criar os testes para guiar nosso desenvolvimento.