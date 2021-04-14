import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/Models/IMailProvider';


interface IRequest {
    email: string
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ){};

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[OneOne] Recuperação de senha',
            templateData: {
                template: 'Olá, {{name}} : {{token}}',
                variables:{
                    name: user.name,
                    token,
                }
            }
        }
        )
    }

}


export default SendForgotPasswordEmailService;
