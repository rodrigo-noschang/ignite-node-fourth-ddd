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