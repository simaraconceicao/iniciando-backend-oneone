import 'reflect-metadata';
import path from 'path';

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

        const forgotPasswordTemplate = path.resolve(
            __dirname, 
            '..',
            'views',
            'forgot_password.hbs',
        )

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[OneOne] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables:{
                    name: user.name,
                    link:`http://localhost:3000/reset_password?token=${token}`,
                }
            }
        }
        )
    }

}


export default SendForgotPasswordEmailService;
