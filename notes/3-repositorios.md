# Repositórios

Durante o desenvolvimento da aplicação, vamos identificando os pontos externos que serão necessários pra ela, como a camada de persistência de dados. Nesse caso, implementaremos a estrutura geral dessas camadas através dos repositórios, e isso é uma escolha pessoal do desenvolvedor e seu time, não é uma regra ou convenção do design. 

Vamos então, dentro de `src/domain` criar a pasta `repositories` e modelar nossas camadas de persistência, a começar pelas respostas:

```ts
    import { Answer } from "../entities/answer";

    export interface AnswersRepository {
        create: (answer: Answer) => Promise<void>
    }
```

E claro, no nosso caso de uso, vamos utilizar esse repositório como uma dependência:

```ts
    export class AnswerQuestionUseCase {
        constructor(private answersRepository: AnswersRepository) { }

        async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
            const answer = new Answer({
                questionId,
                content,
                authorId: instructorId
            });

            await this.answersRepository.create(answer);

            return answer;
        }
    }
```

E agora, nos nossos testes, precisamos passar esse repositório como argumento na criação do caso de uso para responder uma pergunta. Por enquanto, temos o seguinte teste, que gera um erro:

```ts
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

Com dito acima, precisamos passar um repositório das reposta para o `new AnswerQuestionUseCase()`. Porém, ainda não estamos pensando na implementação dessa camada de persistência, estamos apenas pensando no dinâmica de funcionamento no app, nas entidades e nas relações entre elas, não nos interessa como isso será salvo em bancos ou em memória. Para isso, criaremos um repositório fake apenas para cumprir as exigências do teste:

```ts
    const fakeAnswersRepository: AnswersRepository = {
        create: async (answer: Answer) => {
            return;
        }
    }
```

Este repositório (que na verdade é apenas um objeto) não faz nada, mas cumpre com os requisitos do teste e do TypeScript. Agora os testes vão rodar certinho, e já temos uma dinâmica de armazenamento de respostas, mesmo que não implementada. 