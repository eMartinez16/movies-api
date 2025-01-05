import { Role } from "src/core/enum/role.enum";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1735000030655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'name', type: 'varchar' },
                { name: 'email', type: 'varchar' , isUnique: true},
                { name: 'password', type: 'varchar', length: '60' },
                {
                    name: 'role',
                    type: 'enum',
                    enum: [Role.ADMIN_USER, Role.DEFAULT_USER],
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "datetime(6)",
                    default: "CURRENT_TIMESTAMP(6)",
                },
                {
                    name: "updated_at",
                    type: "datetime(6)",
                    default: "CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
                },
                {
                    name: "deleted_at",
                    type: "datetime(6)",
                    isNullable: true,
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
