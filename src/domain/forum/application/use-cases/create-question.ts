import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";

interface CreateQuestionUseCaseRequest {
    title: string,
    content: string,
    authorId: string
}

interface CreateQuestionUseCaseResponse {
    question: Question
}

export class CreateQuestionUseCase {
    constructor(private questionRepository: QuestionsRepository) { }

    async execute({
        authorId,
        title,
        content
    }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
        const question = Question.create({
            authorId: new UniqueEntityId(authorId),
            title,
            content
        });

        this.questionRepository.create(question);

        return {
            question
        }
    }
}