import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingPasswordConfirmationColumn1727371876296
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user ADD COLUMN password_confirmation VARCHAR(255);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user DROP COLUMN password_confirmation;',
    );
  }
}
