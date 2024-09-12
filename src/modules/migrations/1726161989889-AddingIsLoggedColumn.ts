import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingIsLoggedColumn1726161989889 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user ADD COLUMN is_logged BOOLEAN DEFAULT FALSE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user DROP COLUMN is_logged');
  }
}
