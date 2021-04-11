import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

export default class AlterProviderFieldToProviderId1611156389250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('appointments', 'provider')

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider_id',
            type: 'uuid',
            isNullable: true
        })
        )

        await queryRunner.createForeignKey('appointments', new TableForeignKey({
            name: 'AppointmentProvider',
            columnNames: ['provider_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',

        }))
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider')

        await queryRunner.dropForeignKey('appointments', 'provider_id')

        await queryRunner.addColumn('appointments', new TableColumn({
                name:'provider', 
                type: 'varchar',
            })
        )
    }

}
