# Getters e Setters

É importante, como já mencionado antes, não deixar as propriedades das classes/entidades disponíveis para serem alteradas de qualquer jeito, por qualquer um, é recomendável sempre que essas alterações ou leituras sejam feitas através desses métodos getters e setters. Por exemplo, vamos criar os getters da entidade answer:

```ts
    export class Answer extends Entity<AnswerProps> {
        get questionId() {
            return this.props.questionId;
        }

        get authorId() {
            return this.props.authorId;
        }

        get content() {
            return this.props.content;
        }

        get createdAt() {
            return this.props.createdAt;
        }

        get updatedAt() {
            return this.props.updatedAt;
        }

    ...
```

Os métodos getters podem ser usados para pegar todas as propriedades da classe (e geralmente são usados assim mesmo), mas também podem ser usados para retornar algum dado, ou alguma informação daquela instância que não necessariamente é uma propriedade pertinente a ele. Por exemplo, podemos pegar um "resumo" de alguma resposta, para ser exibido em uma chamada para ela própria:

```ts
    get excerpt() {
        return this.content
            .substring(0, 120)
            .trimEnd()
            .concat('...');
    }
```

Perceba que esse excerpt não é uma propriedade que consta na classe Answer, mas ainda assim é um valor que eu consigo retirar dela.

## Setters
Os setters devem ser criados a partir de uma análise relacionada a nossas regras de negócio. É importante perceber quais propriedades de uma classe podem ser alteradas e **como** elas serão alteradas. No caso das respostas, não faz sentido criar um método para alterar o id da pergunta, ou o id do autor, já que são dados que não mudarão nunca. Porém o conteúdo da resposta pode ser editado, então vale a pena fazer um setter para ele:

```ts
    // Na classe Answer:

    set content(newContent: string) {
        this.props.content = newContent;
    }
```

Quando uma alteração na resposta acontece, também é importante atualizarmos o campo `updatedAt`, de forma automática. Ou seja, não queremos que o desenvolvedor faça 

```js
    answer.updatedAt(new Date)
```

Se essa alteração deve ser feita de forma automática, podemos criar um método privado (que só pode ser acessado pela própria classe) e executá-lo sempre que uma alteração acontecer, por exemplo:

```js
    private touch() {
        this.props.updatedAt = new Date();
    }

    set content(newContent: string) {
        this.props.content = newContent;
        this.touch();
    }
```