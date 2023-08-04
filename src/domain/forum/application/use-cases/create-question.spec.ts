import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'
import { CreateQuestionUseCase } from './create-question'

const fakeQuestionsRepository: QuestionsRepository = {
    create: async (question: Question) => { },
}

test('create a question', async () => {
    const sut = new CreateQuestionUseCase(fakeQuestionsRepository);

    const response = await sut.execute({
        title: 'Primeira pergunta',
        content: 'Estou fazendo a minha primeira pergunta',
        authorId: '1'
    })

    expect(response.question.createdAt).toEqual(expect.any(Date));
})
