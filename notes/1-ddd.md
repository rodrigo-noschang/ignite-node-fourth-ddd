# DDD

O DDD - **Domain Driven Design** - é um design de software, ou metodologia para design de software, que nos ajuda a entender a necessidade do cliente e traduzir isso para domínio. Diferentemente das **arquiteturas de softwares**, o design de software pouco tem a ver com código, linguagens e as ferramentas usadas para o seu desenvolvimento (framework, bibliotecas, etc). 

O DDD consiste em conseguir uma forma de comunicação clara e organizada entre todas as partes da aplicação. 

## Domínio:

São as áreas de entendimento da aplicação. São as características do problema que o software precisa resolver. Aqui temos alguns conceitos importantes:

- **Domain Experts**: As pessoas que entendem a fundo o problema que o software precisa resolver, geralmente são os clientes, ou seja, para quem desenvolvemos o software. 

- **Linguagem ubíqua**: A partir de **conversas** com os domain experts, cria-se uma **linguagem ubíqua**, que nada mais é que uma linguagem universal na qual todas as pessoas envolvidas no problema conseguem conversar por igual. Consegue-se entender quem são as entidades da aplicação e referir-se a elas por igual. Por exemplo, comumente se chama o usuário da aplicação de simplesmente usuário. Porém, dependendo de quem for usar esse software, esse usuário vai ter um nome específico. Em um comércio padrão, pode-se ter várias entidades "usuárias", como os clientes, os fornecedores, os funcionários, estes podem divididos em subcategorias, e assim por diante.

Quando o desenvolvedor e os domain experts conseguem se referir a mesma entidade com o mesmo nível de entendimento, criou-se uma linguagem ubíqua. 

## Estrutura do DDD
Quando desenvolvemos seguindo do DDD, temos que pensar na aplicação no jeito mais limpo e desacoplado o possível. A nossa camada principal/mais interna será chamada de domínio e ela precisa existir mesmo se isolada de qualquer contexto externo, APIs, camadas de persistência, assim por diante. Deve ser possível retirar o código dessa aplicação, colocar em uma outra aplicação e a coisa deve seguir funcionando (se as linguagens forem as mesmas).

