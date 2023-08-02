# Classe Base/Core:

Em praticamente todas as entidades, temos características ou propriedades em comum, como o id e o processo de verificação dele/criação de um id randômico, para não precisar repetir isso em todas as entidades, vamos criar uma classe base para isso. Vamos criar uma classe `Entity` na pasta `src/core/entities/entity.ts`:

```ts
    export class Entity {

    }
```

E a partir disso, todas as nossas entidades (classes) vão extender ela. Vamos começar implementando a dinâmica do ID:

```ts
    import { randomUUID } from "node:crypto";

    export class Entity {
        private _id: string;

        get id() {
            return this._id;
        }

        constructor(id?: string) {
            this._id = id ?? randomUUID();
        }
    }
```

Basicamente é a mesma ideia, mas com o id sendo um atributo privado. E vamos também, no construtor das nossas entidades, chamar o super (construtor da Entity) passando pra ela o id e também remover o id como uma propriedade da entidade em si, por exemplo, na entidade Students:

```ts
    export class Student extends Entity {
        public name: string;

        constructor(props: StudentProps, id?: string) {
            super(id);

            this.name = props.name;
        }
    }
```

Agora, como uma próxima otimização, podemos "automatizar" esse processo de designar, para cada propriedade da classe, o valor que ela recebe no constructor. Ao invés de atribuir essas propriedades manualmente, como `content`, `name`, `title`, etc. Vamos criar uma única propriedade que armazena todas essas propriedades. A classe Entity fica da seguinte forma:

```ts
    import { randomUUID } from "node:crypto";

    export class Entity {
        private _id: string;
        protected props: any;

        get id() {
            return this._id;
        }

        constructor(props: any, id?: string) {
            this.props = props;
            this._id = id ?? randomUUID();
        }
    }
```

OBS: A propriedade do tipo **protected** garante que quem pode acessá-la é somente a própria classe, e as classes que herdeiras dela, ou seja, as classes que estendem ela. No caso, todas as nossas entidades. Ao contrário do **private**, que somente a própria classe pode acessar, nesse caso, somente a Entity.

Para usar esse mecanismo das props, nas nossas classes filhas, iremos incluir as propriedades no super:

```ts
    interface AnswerProps {
        content: string
        authorId: string
        questionId: string
    }

    export class Answer extends Entity {

        constructor(props: AnswerProps, id?: string) {
            super(props, id);
        }
    }
```

Porém, como colocamos um `any` ali, não tem como os contextos externos saberem as propriedades de cada entidade, pois a tipagem delas ficou genérica. Vamos corrigir isso criando um **Generic** na nossa classe pai (Entity) que vai mudar conforme a classe que a estende. Vamos incluir esse generic nela:

```ts
    export class Entity<Props> {
        private _id: string;
        protected props: Props;

        get id() {
            return this._id;
        }

        constructor(props: Props, id?: string) {
            this.props = props;
            this._id = id ?? randomUUID();
        }
    }
```

Agora veja que posso passar uma tipagem quando for extender minha classe, e essa tipagem será aplicada a propriedade `props` dentro dessa classe. É uma forma de fazer uma tipagem dinâmica:

```ts
    interface AnswerProps {
        content: string
        authorId: string
        questionId: string
    }

    export class Answer extends Entity<AnswerProps> {

        constructor(props: AnswerProps, id?: string) {
            super(props, id);
        }
    }
```

Agora nossa tipagem já começa a ficar mais forte, mas ainda assim, não é bom deixar os atributos de uma classe públicos, é interessante que eles sejam lidos e alterados através de métodos getters e setters, respectivamente:

```ts
    export class Answer extends Entity<AnswerProps> {
        get content() {
            return this.props.content;
        }

        constructor(props: AnswerProps, id?: string) {
            super(props, id);
        }
    }
```

Para ler a propriedade content, quando uma instância da classe Answer invocar, por exemplo, answer.content, o método get é chamado automaticamente. 

Uma outra otimização é, como os construtores das nossas Entidades somente chamam os super, ou seja, somente chamam o construtor da Entity, podemos deixar eles sem nada: 

```ts
    export class Answer extends Entity<AnswerProps> {
        get content() {
            return this.props.content;
        }
    }
```

Agora o Diegão chutou o balde e separou o método de geração de id da Entity em uma classe separada ainda, pois ele está considerando o ID como um value object separado. Dentro de `src/core/entities/unique-entity-id.ts`:

```ts
    import { randomUUID } from "node:crypto";

    export class UniqueEntityId {
        private value: string;

        toString() {
            return this.value;
        }

        toValue() {
            return this.value;
        }

        constructor(value: string) {
            this.value = value ?? randomUUID();
        }
    }
```

E agora, na nossa classe Entity, vamos trocar a tipagem do id e também sua criação

```ts
    export class Entity<Props> {
        private _id: UniqueEntityId;
        protected props: Props;

        get id() {
            return this._id;
        }

        constructor(props: Props, id?: string) {
            this.props = props;
            this._id = new UniqueEntityId(id);
        }
    }
```

Essas implementações até agora são da prática e preferência do Diegão, o que se tem como definição do DDD é essa separação de entidades, value objects, assim por diante. A forma como isso é feito fica a preferência do freguês.

## Optional

Em algumas entidades, como a Question e Answer, acabamos inserindo propriedades **createdAt** e **updatedAt**. É interessante que a propriedade *createdAt* seja inserida automaticamente na nova instância dessas classes, sem necessidade de ser passada manualmente na criação. Porém, como ela é uma propriedade obrigatória para instâncias dessa classe, e como nas entidades não estamos mais acessando o constructor delas (já que tudo está sendo feito pelo super, que invoca o constructor da Entity), é impossível fazer esse processo pelos meios tradicionais.

Para tentar burlar isso, vamos criar dentro da entidade Question, por exemplo, um método estático `create`, que vai pegar a data atual e passar ela na criação de uma nova instância Question:

```ts
    export class Question extends Entity<QuestionProps> {

        static create(props: QuestionProps, id?: UniqueEntityId) {
            const question = new Question({            
                ...props,
                createdAt: new Date()
            }, id);

            return question;
        }
    }
```

Dessa forma, tiramos a criação da data do método construtor mas, se formos tentar criar uma question por esse método:

```ts
    const question = Question.create({

    })
```

e pedirmos a ajuda do auto complete (Ctrl + Space), ele ainda vai citar o createdAt como uma propriedade obrigatória, nos forçando a inserí-la no momento da criação. Para isso, vamos criar um tipo genérico **Optional** que nos permite reaproveitar uma tipagem, tornando alguns atributos dela opcionais apenas em um alguns contextos ("momentaneamente"):

```ts
    /**
     * Make some property optional on type
     *
     * @example
     * ```typescript
     * type Post {
     *  id: string;
     *  name: string;
     *  email: string;
     * }
     *
     * Optional<Post, 'id' | 'email'>
     * ```
     **/

    export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
```

Como isso vai nos ajudar? Esse método vai nos permitir tornar o createdAt uma propriedade opcional apenas no momento da **criação de uma instância de Question**, mas ele vai continuar sendo obrigatório para a instância em si:

Vamos fazer a seguinte alteração no nosso método create:

```ts
    export class Question extends Entity<QuestionProps> {

        static create(props: Optional<QuestionProps, 'createdAt'>, id?: UniqueEntityId) {
            const question = new Question({
                ...props,
                createdAt: new Date()
            }, id);

            return question;
        }
    }
```

A alteração que nos interessa é:

```ts
    props: Optional<QuestionProps, 'createdAt'>
```

Isso basicamente torna a propriedade createdAt do QuestionProps opcional, mas somente no momento da "criação da instância", que na verdade é o método que chama a criação da instância de fato. E agora, no momento da criação de uma instância de question, o auto complete já nos diz que o createdAt é opcional, mas dentro da instância, ela continua sendo obrigatória.

Vamos também implementar esse sistema de **create** em todas as instâncias, mas no instructor e student, como n tem nada pra ser criado automaticamente, não vai precisar do Optional.

E agora, no nosso `AnswerQuestionUseCase`, precisamos mudar a forma como a resposta é criada. No momento ele está assim:

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

Problemas: o answer é criado pelo método estático create e os id's não podem ser simples strings, precisam ser instâncias da classe `UniqueEntityId`:

```ts
    export class AnswerQuestionUseCase {
        constructor(private answersRepository: AnswersRepository) { }

        async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
            const answer = Answer.create({
                content,
                authorId: new UniqueEntityId(instructorId),
                questionId: new UniqueEntityId(questionId),
            });

            await this.answersRepository.create(answer);

            return answer;
        }
    }
```