# Clean Architecture

O que se viu até agora, em relação a design de software, trata-se de formas de traduzir os problemas e funcionalidades da vida real em software. Já a arquitetura de software diz respeito a forma como o código vai ser implementado. 

O principal termo da arquitetura limpa é o **desacoplamento**, ou seja, a independência entre as camadas da aplicação. 

## Camadas de um software
Da mais externa para a mais interna:

- **Frameworks and Drivers**: É a camada mais interna, é a forma do nosso mundo exterior entrar em contato com a aplicação: usuário, banco de dados, páginas web, dispositivos, etc;

- **Interface Adapters**: Essa é a camada que adapta todos os requisitos da camada anterior para a próxima camada, seu objetivo, além de tornar os dados/informações da camada anterior compreensíveis e compatíveis com a próxima, é proteger esta da implementação direta da camada anterior. Ela garante que a próxima camada (use cases) consegue existir por conta própria, de maneira abstrata, independente da forma como ele está sendo acessado, ou seja, independente de qual ferramente está sendo usada na camada anterior. Exemplos disso são controllers, gateways, assim por diante;

- **Use Cases e Entities**: Aqui moram a funcionalidade da aplicação de fato. Se for implementada de maneira limpa de verdade, essa aplicação pode ser facilmente trocada de ambiente e deve continuar funcionando como antes. Por "trocada de ambiente", entenda uma troca de framework, troca de banco de dados, etc. 

Nomenclatura é sugestiva e ilustrativa, a forma como isso é implementado pode variar, o que importa de fato é que essa separação de camadas exista e também que a dinâmica entre eles se mantenha como descrito acima: da camada mais exterior à camada mais interna. Além disso, é importante notar que **as camadas mais externas podem depender ou fazer uso de recursos de camada mais internas a ela**.

## Refatoração de Pastas
Vamos criar uma nova pasta dentro da pasta **domain**, chamada `forum`, que vai servir como um subdomínio, nele vamos ter uma separação de `enterprise` e `application`. Na application, vamos colocar tudo relacionado a funcionamentos e aplicações (nosso use case e repositórios) e dentro de enterprise, vamos colocar as nossas regras de negócio (entidades). 