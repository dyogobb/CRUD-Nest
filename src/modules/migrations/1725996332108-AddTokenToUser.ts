import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenToUser1725996332108 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD COLUMN "token" VARCHAR(255)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "token"');
  }
}
