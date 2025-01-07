import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFilmsTable1735056105389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'films',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'title', type: 'varchar', isUnique: true},
                { name: 'producer', type: 'varchar' },
                { name: 'director', type: 'varchar' },
                { name: 'episode_id', type: 'int' },
                { name: 'opening_crawl', type: 'text' },              
                {
                    name: "release_date",
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
        await queryRunner.dropTable('films');
    }

}
