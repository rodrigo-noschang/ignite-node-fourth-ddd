# Value Object (para o slug)

Slug nada mais é do que o format do título da pergunta, por exemplo, em uma formatação mais agradável para a máquina, ou seja, sem caracteres especiais, sem acentos, de preferência com hífen no lugar do espaço, assim por diante, para facilitar as buscas no nosso futuro banco de dados. 

Por enquanto, vamos criar o slug apenas para o título da pergunta. 

Esse Slug possui algumas regras de negócio próprias óbvias (não pode possuir nenhum dos caracteres citados acima) e posteriormente podemos ainda incluir regras de negócios opcionais, como por exemplo, a possibilidade do usuário inserir um slug "personalizado" para a pergunta que ele está fazendo. Nesse caso, o slug teria ainda mais verificações e regras de negócio, por ter uma origem que não controlamos. 

Quando uma propriedade de uma entidade tem várias regras de negócio, a ponto de quase parecer uma entidade separada, referimo-nos a ele, no DDD, como um **Value Object**. No caso, o *slug* é uma propriedade da entidade *Question*, mas ela traz consigo verificações e regras de negócio diferentes das demais propriedades da Question, por isso, ela é considerada um Value Object. 

Sendo assim, é interessante, ao invés de criar o Slug como uma propriedade comum de Question, da seguinte forma:

```ts
    interface QuestionProps {
        title: string
        content: string
        authorId: string
        slug: string
    }

    export class Question {
        public id: string;
        public title: string;
        public content: string;
        public authorId: string;
        public slug: string

        constructor(props: QuestionProps, id?: string) {
            this.title = props.title;
            this.content = props.content;
            this.authorId = props.authorId;
            this.slug = props.slug;
            this.id = id ?? randomUUID();
        }
    }
```

Vamos criá-la de forma separada, dentro de `src/domain/entities/value-objects/slug.ts`, e agora, ao invés de slug ser uma propriedade de Question, do tipo string, ela vai ser uma propriedade do tipo Slug, que será definido nesse novo arquivo:

```ts
    export class Slug {
        
    }
```

E a Question fica:

```ts
    interface QuestionProps {
        title: string
        content: string
        authorId: string
        slug: Slug
    }

    export class Question {
        public id: string;
        public title: string;
        public content: string;
        public authorId: string;
        public slug: Slug

        constructor(props: QuestionProps, id?: string) {
            this.title = props.title;
            this.content = props.content;
            this.authorId = props.authorId;
            this.slug = props.slug;
            this.id = id ?? randomUUID();
        }
    }
```

## Implementando a Slug

O nosso Value Object do Slug ficará da seguinte forma:

```ts
    export class Slug {
        public value: string

        constructor(value: string) {
            this.value = value;
        }

        /**
         * Receives a string and normaliza it as a slug
         * 
         * Example: "An example title" => "an-example-title"
         * 
         * 
         * @param text {string}
         */
        static createFromText(text: string) {
            const slugText = text
                .normalize('NFKD')
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/_/g, '-')
                .replace(/--+/g, '-')
                .replace(/-$/g, '')

            return new Slug(slugText);
        }
    }
```

O que mais assusta aqui é o método **createFromText**. As tratativas feitas na string foram as seguintes:
    - Normaliza para uma parão NFKD, que remove acentos, pontuação, etc (acho);
    - Colocar tudo em letra minúscula;
    - Tira espaços extras ao redor da string;
    - Primeiro `replace`: troca todos os espaços internos da string (entre as palavras) por hifens;
    - Segundo `replace`: tira tudo que não é uma palavra da string;
    - Terceiro `replace`: Tira todos os underlines da string e troca por hífen;
    - Quarto `replace`: Tira todos os hifens consecutivos que possam ter ficado;
    - Quinto `replace`: Tira todos os hifens ao final da palavra. 

Depois disso, ele retorna uma instância da própria classe, passando esse slug como parâmetro. Me bugou um pouco mas é da vida isso.

Podemos também já criar os testes para o slug:

```ts
    import { expect, test } from "vitest";
    import { Slug } from "./slug";

    test('it should be able to create a new slug from text', () => {
        const slug = Slug.createFromText('Example Question Title');

        expect(slug.value).toEqual('example-question-title');
    })
```

--- Parte (5) ---